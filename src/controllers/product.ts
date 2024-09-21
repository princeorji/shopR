import { RequestHandler } from 'express';
import Products from '../models/product';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const products: RequestHandler = async (req, res, next) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getById: RequestHandler = async (req, res, next) => {
  const { productId } = req.params;

  try {
    if (!mongoose.isValidObjectId(productId)) {
      throw createHttpError(400, 'Invalid product id');
    }
    const product = await Products.findById(productId);

    if (!product) {
      throw createHttpError(404, 'Product not found');
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
