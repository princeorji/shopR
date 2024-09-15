import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import session from 'express-session';
import createHttpError, { isHttpError } from 'http-errors';
import morgan from 'morgan';
import env from './utils/validateEnv';
import MongoStore from 'connect-mongo';
import { isAuthenticated } from './middlewares/auth';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 100, // 1 hour
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.DATABASE,
    }),
  })
);

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', isAuthenticated, cartRoutes);

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
