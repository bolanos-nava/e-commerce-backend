import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import {
  logHttp,
  updateLastActiveAtMiddleware,
} from '../../middlewares/index.js';

export const productsViewsRouter = Router();

productsViewsRouter
  .route('/')
  .get(
    logHttp('Rendering products view'),
    updateLastActiveAtMiddleware(),
    controllers.productsViews.renderProductsView.bind(
      controllers.productsViews,
    ),
  );

productsViewsRouter
  .route('/realtimeproducts')
  .get(
    logHttp('Rendering real time products view'),
    updateLastActiveAtMiddleware(),
    controllers.productsViews.renderRealTimeProductsView.bind(
      controllers.productsViews,
    ),
  );
