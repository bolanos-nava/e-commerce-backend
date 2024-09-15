import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import {
  authorize,
  logHttp,
  passportStrategyErrorWrapper,
} from '../../middlewares/middlewares.js';

const router = Router();

router
  .route('/') // path
  .get(
    logHttp('Listing users'),
    authorize('admin'),
    controllers.users.list.bind(controllers.users),
  )
  .post(
    logHttp('Registering user'),
    (req, _, next) => {
      req.body = req.body.user;
      next();
    },
    passportStrategyErrorWrapper('register'),
    controllers.users.create.bind(controllers.users),
  )
  .delete(
    logHttp('Deleting inactive users'),
    authorize('admin'),
    controllers.users.deleteInactiveUsers.bind(controllers.users),
  );

router
  .route('/:userId') // path
  .get(
    logHttp('Showing user'),
    authorize('admin'),
    controllers.users.show.bind(controllers.users),
  )
  .put(
    logHttp('Updating user'),
    authorize('admin'),
    controllers.users.update.bind(controllers.users),
  )
  .delete(
    logHttp('Deleting user'),
    authorize('admin'),
    controllers.users.delete.bind(controllers.users),
  );

export const usersRouter = {
  basePath: '/users',
  router,
};
