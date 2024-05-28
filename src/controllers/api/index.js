import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
import ProductsController from './ProductsController.js';
import UsersController from './UsersController.js';
import SessionsController from './SessionsController.js';

const apiControllers = {
  products: new ProductsController(),
  carts: new CartsController(),
  messages: new MessagesController(),
  users: new UsersController(),
  sessions: new SessionsController(),
};

export default apiControllers;
