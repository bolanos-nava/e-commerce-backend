import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { authorize, logHttp } from '../../middlewares/index.js';

export const ticketsViewsRouter = Router();

ticketsViewsRouter
  .route('/tickets/:ticketId/success') // path
  .get(
    logHttp('View: success page'),
    authorize('user', 'user_premium'),
    controllers.ticketsViews.renderSuccessView.bind(controllers.ticketsViews),
  );
