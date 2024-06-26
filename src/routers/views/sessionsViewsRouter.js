import { Router } from 'express';
import controllers from '../../controllers/views/index.js';

export const sessionsViewsRouter = Router();

sessionsViewsRouter.get(
  '/register',
  controllers.sessionViews.renderRegisterView,
);
sessionsViewsRouter.get('/login', controllers.sessionViews.renderLoginView);
