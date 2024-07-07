import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

const router = Router();

router.post('/', controllers.messages.saveNewMessage);

export const messagesRouter = {
  basePath: '/messages',
  router,
};
