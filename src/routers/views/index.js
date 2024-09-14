import { cartsViewsRouter } from './cartsViewsRouter.js';
import { messagesViewsRouter } from './messagesViewsRouter.js';
import { productsViewsRouter } from './productsViewsRouter.js';
import { sessionsViewsRouter } from './sessionsViewsRouter.js';
import { ticketsViewsRouter } from './ticketsViewsRouter.js';
import { usersViewsRouter } from './usersViewsRouter.js';

const viewsRouters = [
  cartsViewsRouter,
  productsViewsRouter,
  messagesViewsRouter,
  sessionsViewsRouter,
  ticketsViewsRouter,
  usersViewsRouter,
];

export default viewsRouters;
