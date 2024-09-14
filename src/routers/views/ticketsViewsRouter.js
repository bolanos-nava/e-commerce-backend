import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const ticketsViewsRouter = Router();

ticketsViewsRouter
  .route('/tickets/:ticketId/success') // path
  .get(
    logHttp('View: success page'),
    controllers.ticketsViews.renderSuccessView.bind(controllers.ticketsViews)
  );
