import express from 'express';
import * as controller from '../controllers/user';
import { isAuthenticated } from '../middlewares/auth';
import { authLimiter, globalLimiter } from '../middlewares/rate-limit';

const routes = express.Router();

routes.get(
  '/',
  globalLimiter,
  isAuthenticated,
  controller.getAuthenticatedUser
);

routes.post('/signup', authLimiter, controller.signup);

routes.post('/login', authLimiter, controller.login);

routes.get('/logout', controller.logout);

export default routes;
