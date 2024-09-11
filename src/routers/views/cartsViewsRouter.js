import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import {
  logHttp,
  updateLastActiveAtMiddleware,
} from '../../middlewares/index.js';

export const cartsViewsRouter = Router();

cartsViewsRouter
  .route('/cart/:cartId') // path
  .get(
    logHttp('Rendering cart detail view'),
    updateLastActiveAtMiddleware(),
    controllers.cartsViews.renderCartDetailView.bind(controllers.cartsViews),
  );
