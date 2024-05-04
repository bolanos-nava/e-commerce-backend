import { Router } from 'express';
import controllers from '../controllers/api/index.js';

export const apiRouter = Router();

Object.values(controllers).forEach(({ path, controller }) => {
  const router = Router();
  controller.setupRoutes(router);
  apiRouter.use(path, router);
});
