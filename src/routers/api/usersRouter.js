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

export const usersRouter = {
  basePath: '/users',
  router,
};
