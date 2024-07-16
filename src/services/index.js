// DAOs
import daos from '../daos/index.js';
// Services
import CartsService from './CartsService.js';
import MessagesService from './MessagesService.js';
import ProductsService from './ProductsService.js';
import TicketsService from './TicketsService.js';
import UsersService from './UsersService.js';

const services = {
  carts: new CartsService(daos.carts),
  messages: new MessagesService(daos.messages),
  products: new ProductsService(daos.products),
  tickets: new TicketsService(daos.tickets),
  users: new UsersService(daos.users),
};

export default services;
