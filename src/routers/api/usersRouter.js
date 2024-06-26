import { Router } from 'express';
import passport from 'passport';
import controllers from '../../controllers/api/index.js';

const _usersRouter = Router();

_usersRouter.post(
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
  router: _usersRouter,
};
