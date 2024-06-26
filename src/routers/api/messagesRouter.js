import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

const _messagesRouter = Router();

_messagesRouter.post('/', controllers.messages.saveNewMessage);

export const messagesRouter = {
  basePath: '/messages',
  router: _messagesRouter,
};
