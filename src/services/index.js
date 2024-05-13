import { CartsService } from './carts.service.js';
import { ProductsService } from './products.service.js';

const services = {
  products: new ProductsService(),
  carts: new CartsService(),
};

export default services;
