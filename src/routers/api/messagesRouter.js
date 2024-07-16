import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize } from '../../middlewares/index.js';

const router = Router();

router.post('/', authorize('user'), controllers.messages.create);

export const messagesRouter = {
  basePath: '/messages',
  router,
};
