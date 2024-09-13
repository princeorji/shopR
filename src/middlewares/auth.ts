import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, 'Unauthorized'));
  }
};
