import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const cartsViewsRouter = Router();

const { cartsViews } = viewsControllers;

cartsViewsRouter
  .route('/cart/:cartId') // path
  .get(logHttp('Rendering cart detail view'), cartsViews.renderCartDetailView);
