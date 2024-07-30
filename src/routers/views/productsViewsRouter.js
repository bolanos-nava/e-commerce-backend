import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const productsViewsRouter = Router();

const { productsViews } = viewsControllers;

productsViewsRouter
  .route('/')
  .get(logHttp('Rendering products view'), productsViews.renderProductsView);

productsViewsRouter
  .route('/realtimeproducts')
  .get(
    logHttp('Rendering real time products view'),
    productsViews.renderRealTimeProductsView,
  );
