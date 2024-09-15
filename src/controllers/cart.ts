import { RequestHandler } from 'express';
import Cart from '../models/cart';
import CartItem from '../models/cartItem';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import Stripe from 'stripe';
import env from '../utils/validateEnv';
import Products from '../models/product';
import Orders from '../models/order';
import { OrderStatus } from '../enums/orderStatus';
import OrderItem from '../models/orderItem';

const stripe = new Stripe(env.STRIPE_SECRET, {
  apiVersion: '2024-06-20',
});

interface CartBody {
  productId: string;
  quantity: any;
}

export const addToCart: RequestHandler<
  unknown,
  unknown,
  CartBody,
  unknown
> = async (req, res, next) => {
  const userId = req.session.userId;
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      throw createHttpError(400, 'Parameters missing');
    }
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let item = await CartItem.findOne({ cartId: cart._id, productId });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({
        cartId: cart._id,
        productId,
        quantity,
      });
    }

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const cart: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw createHttpError(404, 'Cart not found');
    }

    const items = await CartItem.find({ cartId: cart._id }).populate(
      'productId',
      'name description price'
    );

    if (items.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    res.status(200).json({
      cart: cart._id,
      items,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  const { itemId } = req.params;

  try {
    if (!mongoose.isValidObjectId(itemId)) {
      throw createHttpError(400, 'Invalid item id');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw createHttpError(404, 'Cart not found');
    }

    const item = await CartItem.findByIdAndDelete({
      _id: itemId,
      cartId: cart._id,
    });

    if (!item) {
      throw createHttpError(404, 'Item not found');
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const checkout: RequestHandler = async (req, res, next) => {
  const { cartId } = req.params;

  try {
    if (!mongoose.isValidObjectId(cartId)) {
      throw createHttpError(400, 'Invalid cart id');
    }

    const items = await CartItem.find({ cartId });

    if (items.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    // Calculate total price
    let total = 0;

    for (const item of items) {
      const product = await Products.findOne({ _id: item.productId });

      if (product && product.price) {
        total += product.price * item.quantity;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // amount in kobo
      currency: 'ngn',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      paymentIntentId: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

interface finalizeOrderParams {
  cartId: string;
}

interface finalizeOrderBody {
  paymentIntentId: string;
}

export const finalizeOrder: RequestHandler<
  finalizeOrderParams,
  unknown,
  finalizeOrderBody,
  unknown
> = async (req, res, next) => {
  const userId = req.session.userId;
  const { paymentIntentId } = req.body;
  const { cartId } = req.params;

  try {
    if (!mongoose.isValidObjectId(cartId)) {
      throw createHttpError(400, 'Invalid cart id');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      throw createHttpError(400, 'Payment not successful');
    }

    const items = await CartItem.find({ cartId });

    if (items.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    let total = 0;

    for (const item of items) {
      const product = await Products.findById(item.productId);

      if (product && product.price) {
        total += product.price * item.quantity;
      }
    }

    const order = await Orders.create({
      userId,
      total,
      status: OrderStatus.PENDING,
    });

    for (const item of items) {
      const product = await Products.findById(item.productId);

      await OrderItem.create({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        itemPrice: product?.price,
      });
    }

    // Clear cart items
    await CartItem.deleteMany({ cartId });

    res.status(200).json({ orderId: order._id });
  } catch (error) {
    next(error);
  }
};
