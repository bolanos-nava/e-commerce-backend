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
  passport.authenticate('github', {
    scope: ['user:email'],
    failureRedirect: '/login?error=third_party_auth_error',
  }),
);
_sessionsRouter.get(
  '/github',
  passport.authenticate('github'),
  // TODO: add error handling and show appropriate error messages in frontend when passport auth fails
  // (err, req, res, next) => {
  //   if (err) {
  //     console.error(`Passport error: ${err}`);
  //     return res.redirect('/login?error=third_party_auth_error');
  //   }
  //   next();
  // },
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
