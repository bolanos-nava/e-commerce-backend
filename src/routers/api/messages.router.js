import { Router } from 'express';
import apiControllers from '../../controllers/api/index.js';

const _messagesRouter = Router();

const { messages } = apiControllers;

_messagesRouter.post('/', messages.createMessage);

export const messagesRouter = {
  basePath: '/products',
  router: _messagesRouter,
};
