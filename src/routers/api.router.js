import { Router } from 'express';
import { productsRouter, cartsRouter } from './api/index.js';

export const apiRouter = Router();

apiRouter.use('/products', productsRouter);
apiRouter.use('/carts', cartsRouter);
