import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { isHttpError } from 'http-errors';

const app = express();

app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let message = 'An unknown error occurred';
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    message = error.message;
  }
  res.status(statusCode).json({ error: message });
});

export default app;
