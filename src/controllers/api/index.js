import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
import ProductsController from './ProductsController.js';
import UsersController from './UsersController.js';
import SessionsController from './SessionsController.js';

// Dependencies to inject
import { JwtUtil } from '../../utils/index.js';
import repository from '../../services/repository.js';
import { env } from '../../configs/index.js';

const apiControllers = {
  products: new ProductsController(repository.products),
  carts: new CartsController(repository.carts),
  messages: new MessagesController(repository.messages),
  users: new UsersController(repository.users),
  sessions: new SessionsController(new JwtUtil(env.JWT_PRIVATE_KEY, '15m')),
};

export default apiControllers;
