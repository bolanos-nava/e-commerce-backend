import { cartsViewsRouter } from './cartsViewsRouter.js';
import { messagesViewsRouter } from './messagesViewsRouter.js';
import { productsViewsRouter } from './productsViewsRouter.js';
import { sessionsViewsRouter } from './sessionsViewsRouter.js';

const viewsRouters = [
  cartsViewsRouter,
  productsViewsRouter,
  messagesViewsRouter,
  sessionsViewsRouter,
];

export default viewsRouters;
