import { Router } from 'express';
import apiControllers from '../../controllers/api/index.js';

const _messagesRouter = Router();

const { messages } = apiControllers;

_messagesRouter.post('/', messages.saveNewMessage);

export const messagesRouter = {
  basePath: '/messages',
  router: _messagesRouter,
};
