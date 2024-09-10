import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const productsViewsRouter = Router();

productsViewsRouter.route('/').get(
  logHttp('Rendering products view'),
  // controllers.productsViews.renderProductsView,
  // (req, res, next) =>
  //   controllers.productsViews.renderProductsView(req, res, next),
  controllers.productsViews.renderProductsView.bind(controllers.productsViews),
);

productsViewsRouter
  .route('/realtimeproducts')
  .get(
    logHttp('Rendering real time products view'),
    controllers.productsViews.renderRealTimeProductsView.bind(
      controllers.productsViews,
    ),
  );
