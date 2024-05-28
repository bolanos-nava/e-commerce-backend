import { cartsViewsRouter } from './carts.views.router.js';
import { messagesViewsRouter } from './messages.views.router.js';
import { productsViewsRouter } from './products.views.router.js';
import { sessionViewsRouter } from './session.views.router.js';

const viewsRouters = [
  cartsViewsRouter,
  productsViewsRouter,
  messagesViewsRouter,
  sessionViewsRouter,
];

export default viewsRouters;
