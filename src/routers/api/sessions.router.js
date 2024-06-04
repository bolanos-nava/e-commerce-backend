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
  sessions.login,
);
_sessionsRouter.delete('/', sessions.logout);

_sessionsRouter.get(
  '/github/login',
  passport.authenticate('github', { scope: ['user:email'] }),
);
_sessionsRouter.get(
  '/github',
  passport.authenticate('github', { failureRedirect: '/login' }),
  sessions.loginGitHub,
);
// _sessionsRouter.get(
//   '/github',
//   passport.authenticate('github', { scope: ['user:email'] }),
//   sessions.loginGitHub,
// );

export const sessionsRouter = {
  basePath: '/sessions',
  router: _sessionsRouter,
};
