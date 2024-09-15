import { RequestHandler } from 'express';
import Orders from '../models/order';
import OrderItem from '../models/orderItem';
import createHttpError from 'http-errors';

export const orders: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    const orders = await Orders.find({ userId });

    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: 'You have no orders at this time' });
    }

    const payload = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).select(
          '-orderId'
        );
        return {
          orderId: order._id,
          total: order.total,
          status: order.status,
          items,
        };
      })
    );

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

export const getById: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  const { orderId } = req.params;

  try {
    const order = await Orders.findOne({ _id: orderId, userId });
    if (!order) {
      throw createHttpError(404, 'Order not found');
    }

    const items = await OrderItem.find({ orderId: order._id }).select(
      '-orderId'
    );

    res.status(200).json({
      orderId: order._id,
      items,
    });
  } catch (error) {
    next(error);
  }
};
