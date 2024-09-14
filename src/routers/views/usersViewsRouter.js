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

usersViewsRouter
  .route('/users/:userId/edit') // path;
  .get(
    logHttp('Rendering user edit view'),
    authorize('admin'),
    controllers.usersViews.renderUserEditView.bind(controllers.usersViews),
  );
