import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';

export const messagesViewsRouter = Router();

const { messagesViews } = viewsControllers;

messagesViewsRouter.get('/chat', messagesViews.renderChatView);
