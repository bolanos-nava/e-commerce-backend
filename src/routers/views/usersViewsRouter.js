import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { logHttp, authorize } from '../../middlewares/index.js';

export const usersViewsRouter = Router();

usersViewsRouter
  .route('/users') // path
  .get(
    logHttp('Rendering users view'),
    authorize('admin'),
    controllers.usersViews.renderUsersView.bind(controllers.usersViews),
  );
