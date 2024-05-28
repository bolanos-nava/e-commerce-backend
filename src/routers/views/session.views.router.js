import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';

export const sessionViewsRouter = Router();

const { sessionViews } = viewsControllers;

sessionViewsRouter.get('/register', sessionViews.renderRegisterView);
sessionViewsRouter.get('/login', sessionViews.renderLoginView);
