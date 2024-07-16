import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { passportStrategyErrorWrapper } from '../../middlewares/middlewares.js';

const router = Router();

router
  .route('/') // path
  .post(
    (req, _, next) => {
      req.body = req.body.user;
      next();
    },
    passportStrategyErrorWrapper('register'),
    controllers.users.create,
  );

export const usersRouter = {
  basePath: '/users',
  router,
};
