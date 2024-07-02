import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';

export const productsViewsRouter = Router();

const { productsViews } = viewsControllers;

productsViewsRouter.get('/', productsViews.renderProductsView);
productsViewsRouter.get(
  '/realtimeproducts',
  productsViews.renderRealTimeProductsView,
);
