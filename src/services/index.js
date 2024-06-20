import CartsService from './carts.service.js';
import ProductsService from './products.service.js';
import MessagesService from './messages.service.js';
import UsersService from './users.service.js';

// Dependencies to inject
import { Cart, Product, Message, User } from '../daos/models/index.js';

const services = {
  products: new ProductsService(Product),
  carts: new CartsService(Cart, Product),
  messages: new MessagesService(Message),
  users: new UsersService(User),
};

export default services;
