import { Router } from 'express';
import passport from 'passport';
import controllers from '../../controllers/api/index.js';
import { UnauthorizedError, CustomError } from '../../customErrors/index.js';

const _sessionsRouter = Router();

_sessionsRouter.post(
  '/jwt',
  passport.authenticate('login', {
    failureRedirect: '/login?error=bad_credentials',
  }),
  controllers.sessions.login,
);
_sessionsRouter.delete('/jwt', controllers.sessions.logout);

_sessionsRouter.post(
  '/current',
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (error) return next(new CustomError(error));
      if (!user) {
        return next(new UnauthorizedError(info.toString() || 'No JWT present'));
      }
      next();
    })(req, res, next);
  },
  (req, res) => {
    console.log('user', req.user);
    res.json({ jwt: req.user });
  },
);

/** GH entrypoint */
_sessionsRouter.get(
  '/github/login',
  passport.authenticate('github', {
    scope: ['user:email'],
    failureRedirect: '/login?error=third_party_auth_error',
    session: false,
  }),
);
/** GH callback */
_sessionsRouter.get(
  '/github',
  passport.authenticate('github', { session: false }),
  // TODO: add error handling and show appropriate error messages in frontend when passport auth fails
  controllers.sessions.loginGitHub,
);

export const sessionsRouter = {
  basePath: '/sessions',
  router: _sessionsRouter,
};
