import { RequestHandler } from 'express';
import Cart from '../models/cart';
import CartItem from '../models/cartItem';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';

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
