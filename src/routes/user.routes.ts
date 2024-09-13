import express from 'express';
import * as controller from '../controllers/user';
import { isAuthenticated } from '../middlewares/auth';

const routes = express.Router();

routes.get('/', isAuthenticated, controller.getAuthenticatedUser);

routes.post('/signup', controller.signup);

routes.post('/login', controller.login);

routes.get('/logout', controller.logout);

export default routes;
