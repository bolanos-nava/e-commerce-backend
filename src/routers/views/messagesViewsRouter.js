import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { logHttp } from '../../middlewares/index.js';

export const messagesViewsRouter = Router();

messagesViewsRouter
  .route('/chat')
  .get(
    logHttp('Render chat view'),
    controllers.messagesViews.renderChatView.bind(controllers.messagesViews),
  );
