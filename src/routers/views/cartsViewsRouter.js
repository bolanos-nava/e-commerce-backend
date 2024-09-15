import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import {
  authorize,
  logHttp,
  updateLastActiveAtMiddleware,
} from '../../middlewares/index.js';

export const cartsViewsRouter = Router();

cartsViewsRouter
  .route('/cart/:cartId') // path
  .get(
    logHttp('Rendering cart detail view'),
    authorize('user', 'user_premium', 'anon'),
    updateLastActiveAtMiddleware(),
    controllers.cartsViews.renderCartDetailView.bind(controllers.cartsViews),
  );
