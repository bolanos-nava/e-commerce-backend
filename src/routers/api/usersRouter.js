import { Router } from 'express';
import passport from 'passport';
import controllers from '../../controllers/api/index.js';

const router = Router();

router.post(
  '/',
  (req, res, next) => {
    req.body = req.body.user;
    next();
  },
  passport.authenticate('register'),
  controllers.users.create,
);

export const usersRouter = {
  basePath: '/users',
  router,
};
