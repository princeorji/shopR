import express from 'express';
import * as controller from '../controllers/order';

const routes = express.Router();

routes.get('', controller.orders);

routes.get('/:orderId', controller.getById);

export default routes;
