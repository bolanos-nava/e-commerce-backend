import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDefinition from '../docs/index.js';
import apiRouters from './api/index.js';

export const apiRouter = Router();

apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

apiRouters.forEach(({ basePath, router }) => {
  apiRouter.use(basePath, router);
});
