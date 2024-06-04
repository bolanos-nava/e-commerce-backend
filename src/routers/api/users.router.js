import { Router } from 'express';
import passport from 'passport';
import apiControllers from '../../controllers/api/index.js';

const _usersRouter = Router();

const { users } = apiControllers;

_usersRouter.post(
  '/',
  passport.authenticate('register', {
    failureRedirect: '/register?error=bad_form',
    failureMessage: true,
  }),
  users.registerUserP,
);

export const usersRouter = {
  basePath: '/users',
  router: _usersRouter,
};
