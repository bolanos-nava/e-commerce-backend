import { Router } from 'express';
import controllers from '../../controllers/views/index.js';
import { authorize, logHttp } from '../../middlewares/index.js';

export const messagesViewsRouter = Router();

messagesViewsRouter
  .route('/chat')
  .get(
    logHttp('Render chat view'),
    authorize('user', 'user_premium'),
    controllers.messagesViews.renderChatView.bind(controllers.messagesViews),
  );
