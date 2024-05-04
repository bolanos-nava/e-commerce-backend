import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

export const productsRouter = Router();

controllers.productsController.setupRoutes(productsRouter);
