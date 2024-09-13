import express from 'express';
import * as controller from '../controllers/product';

const routes = express.Router();

routes.get('', controller.products);

routes.get('/:id', controller.getById);

export default routes;
