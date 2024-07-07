import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
import ProductsController from './ProductsController.js';
import UsersController from './UsersController.js';
import SessionsController from './SessionsController.js';

// Dependencies to inject
import { JwtUtil } from '../../utils/index.js';
import { daos } from '../../daos/index.js';
import { env } from '../../configs/index.js';
import services from '../../services/index.js';

const apiControllers = {
  products: new ProductsController(services.products),
  carts: new CartsController(services.carts),
  messages: new MessagesController(daos.messages),
  users: new UsersController(daos.users),
  sessions: new SessionsController(new JwtUtil(env.JWT_PRIVATE_KEY, '15m')),
};

export default apiControllers;
