import CartsService from './carts.service.js';
import ProductsService from './products.service.js';
import MessagesService from './messages.service.js';

const services = {
  products: new ProductsService(),
  carts: new CartsService(),
  messages: new MessagesService(),
};

export default services;
