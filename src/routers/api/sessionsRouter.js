import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import {
  logHttp,
  passportStrategyErrorWrapper,
  updateLastActiveAtMiddleware,
} from '../../middlewares/middlewares.js';

const router = Router();

/* ****************************** */
// PATH /
router
  .route('/') // path
  .post(
    logHttp('Route: Logging in'),
    passportStrategyErrorWrapper('login', {
      failureRedirect: '/login?error=bad_credentials',
    }),
    controllers.sessions.login.bind(controllers.sessions),
  )
  .delete(
    logHttp('Route: Logging out'),
    controllers.sessions.logout.bind(controllers.sessions),
  );

/* ****************************** */
// PATH /current
router
  .route('/current') // path
  .get(
    logHttp('Route: Getting current session'),
    updateLastActiveAtMiddleware(),
    controllers.sessions.currentSession.bind(controllers.sessions),
  );

/* ****************************** */
// GitHub paths for login
/** GH entrypoint */
router
  .route('/github/login') // path
  .get(
    passportStrategyErrorWrapper('login', {
      scope: ['user:email'],
      failureRedirect: '/login?error=third_party_auth_error',
      session: false,
    }),
  );
/** GH callback */
router
  .route('/github') // path
  .get(
    passportStrategyErrorWrapper('github'),
    // TODO: add error handling and show appropriate error messages in frontend when passport auth fails
    controllers.sessions.loginGitHub.bind(controllers.sessions),
  );

export const sessionsRouter = {
  basePath: '/sessions',
  router,
};
