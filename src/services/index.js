import CartsService from './carts.service.js';
import ProductsService from './products.service.js';
import MessagesService from './messages.service.js';
import UsersService from './users.service.js';

const services = {
  products: new ProductsService(),
  carts: new CartsService(),
  messages: new MessagesService(),
  users: new UsersService(),
};

export default services;
