import { Router } from 'express';
import passport from 'passport';
import apiControllers from '../../controllers/api/index.js';

const _sessionsRouter = Router();

const { sessions } = apiControllers;

_sessionsRouter.post(
  '/',
  passport.authenticate('login', {
    failureRedirect: '/login?error=bad_credentials',
  }),
  sessions.loginP,
);
_sessionsRouter.delete('/', sessions.logout);

export const sessionsRouter = {
  basePath: '/sessions',
  router: _sessionsRouter,
};
