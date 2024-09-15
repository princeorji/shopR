import express from 'express';
import * as controller from '../controllers/cart';

const routes = express.Router();

routes.post('', controller.addToCart);

routes.get('', controller.cart);

routes.delete('/:itemId', controller.removeCartItem);

routes.post('/:cartId/checkout', controller.checkout);

routes.post('/:cartId/order', controller.finalizeOrder);

export default routes;
