import { Router } from 'express';
import viewsControllers from '../../controllers/views/index.js';

export const cartsViewsRouter = Router();

const { cartsViews } = viewsControllers;

cartsViewsRouter.get('/cart/:cartId', cartsViews.renderCartDetailView);
