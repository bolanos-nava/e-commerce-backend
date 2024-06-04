import { Router } from 'express';
import passport from 'passport';
import apiControllers from '../../controllers/api/index.js';

const _usersRouter = Router();

const { users } = apiControllers;

_usersRouter.post(
  '/',
  (req, res, next) => {
    req.body = req.body.user;
    next();
  },
  passport.authenticate('register'),
  users.registerUser,
);

export const usersRouter = {
  basePath: '/users',
  router: _usersRouter,
};
