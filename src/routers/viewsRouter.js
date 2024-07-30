import { Router } from 'express';
import viewsRouters from './views/index.js';

export const viewsRouter = Router();

viewsRouters.forEach((router) => {
  viewsRouter.use('/', router);
});
