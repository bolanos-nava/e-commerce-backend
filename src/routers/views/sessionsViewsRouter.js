import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const sessionsViewsRouter = Router();

sessionsViewsRouter
  .route('/register')
  .get(
    logHttp('Rendering register view'),
    controllers.sessionViews.renderRegisterView.bind(controllers.sessionViews),
  );

sessionsViewsRouter
  .route('/login')
  .get(
    logHttp('Rendering login view'),
    controllers.sessionViews.renderLoginView.bind(controllers.sessionViews),
  );
