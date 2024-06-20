import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
import ProductsController from './ProductsController.js';
import UsersController from './UsersController.js';
import SessionsController from './SessionsController.js';

// Dependencies to inject
import { JwtTokenFactory } from '../../utils/index.js';
import services from '../../services/index.js';
import { env } from '../../configs/index.js';

const apiControllers = {
  products: new ProductsController(services.products),
  carts: new CartsController(services.carts),
  messages: new MessagesController(services.messages),
  users: new UsersController(services.users),
  sessions: new SessionsController(
    new JwtTokenFactory(env.JWT_PRIVATE_KEY, '15m'),
  ),
};

export default apiControllers;
