import { cartsRouter } from './carts.router.js';
import { productsRouter } from './products.router.js';
import { messagesRouter } from './messages.router.js';
import { usersRouter } from './users.router.js';
import { sessionsRouter } from './sessions.router.js';

const apiRouters = [
  cartsRouter,
  productsRouter,
  messagesRouter,
  usersRouter,
  sessionsRouter,
];

export default apiRouters;
