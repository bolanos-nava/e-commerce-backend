import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const messagesViewsRouter = Router();

const { messagesViews } = viewsControllers;

messagesViewsRouter
  .route('/chat')
  .get(logHttp('Render chat view'), messagesViews.renderChatView);
