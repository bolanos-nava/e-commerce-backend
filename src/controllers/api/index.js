import CartsController from './CartsController.js';
import ProductsController from './ProductsController.js';

const controllers = {
  products: {
    path: '/products',
    controller: new ProductsController(),
  },
  carts: {
    path: '/carts',
    controller: new CartsController(),
  },
};

export default controllers;
