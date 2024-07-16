// Controllers
import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
import ProductsController from './ProductsController.js';
import SessionsController from './SessionsController.js';
import UsersController from './UsersController.js';
// Dependencies to inject
import { JwtUtil } from '../../utils/index.js';
import { env } from '../../configs/index.js';
import services from '../../services/index.js';

const apiControllers = {
  products: new ProductsController(services.products),
  carts: new CartsController({
    cartsService: services.carts,
    productsService: services.products,
    ticketsService: services.tickets,
    usersService: services.users,
  }),
  messages: new MessagesController(services.messages),
  users: new UsersController(),
  sessions: new SessionsController(
    new JwtUtil(env.JWT_PRIVATE_KEY, '24h'),
    services.carts,
  ),
};

export default apiControllers;
