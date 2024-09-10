import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize, logHttp } from '../../middlewares/index.js';

const router = Router();

/* ****************************** */
// PATH /
router
  .route('/') // path
  .post(
    logHttp('Creating message'),
    authorize('user'),
    controllers.messages.create.bind(controllers.messages),
  );

export const messagesRouter = {
  basePath: '/messages',
  router,
};
