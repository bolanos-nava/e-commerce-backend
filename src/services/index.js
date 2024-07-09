import ProductsService from './ProductsService.js';
import { daos } from '../daos/index.js';
import CartsService from './CartsService.js';
import UsersService from './UsersService.js';
import TicketsService from './TicketsService.js';

const services = {
  products: new ProductsService(daos.products),
  carts: new CartsService(daos.carts),
  users: new UsersService(daos.users),
  tickets: new TicketsService(daos.tickets),
};

export default services;
