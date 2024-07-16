import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { passportStrategyErrorWrapper } from '../../middlewares/middlewares.js';

const router = Router();

router
  .route('/')
  .post(
    passportStrategyErrorWrapper('login', {
      failureRedirect: '/login?error=bad_credentials',
    }),
    controllers.sessions.login,
  )
  .delete(controllers.sessions.logout);

router
  .route('/current')
  .get(
    passportStrategyErrorWrapper('jwt'),
    controllers.sessions.currentSession,
  );

/** GH entrypoint */
router.route('/github/login').get(
  passportStrategyErrorWrapper('login', {
    scope: ['user:email'],
    failureRedirect: '/login?error=third_party_auth_error',
    session: false,
  }),
);
/** GH callback */
router.route('/github').get(
  passportStrategyErrorWrapper('github'),
  // TODO: add error handling and show appropriate error messages in frontend when passport auth fails
  controllers.sessions.loginGitHub,
);

export const sessionsRouter = {
  basePath: '/sessions',
  router,
};
