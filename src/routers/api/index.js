import { cartsRouter } from './cartsRouter.js';
import { productsRouter } from './productsRouter.js';
import { messagesRouter } from './messagesRouter.js';
import { usersRouter } from './usersRouter.js';
import { sessionsRouter } from './sessionsRouter.js';

const apiRouters = [
  cartsRouter,
  productsRouter,
  messagesRouter,
  usersRouter,
  sessionsRouter,
];

export default apiRouters;
