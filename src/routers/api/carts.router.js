import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

export const cartsRouter = Router();

controllers.cartsController.addRoutes(cartsRouter);
