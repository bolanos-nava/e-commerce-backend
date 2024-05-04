import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from './openapi.js';
import controllers from '../controllers/api/index.js';

export const apiRouter = Router();

apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

Object.values(controllers).forEach(({ path, controller }) => {
  const router = Router();
  controller.setupRoutes(router);
  apiRouter.use(path, router);
});
