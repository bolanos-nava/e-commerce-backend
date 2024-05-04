import { Router } from 'express';
import viewsController from '../controllers/views/index.js';

export const viewsRouter = Router();

viewsController.addViews(viewsRouter);
