import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
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
  messages: {
    path: '/messages',
    controller: new MessagesController(),
  },
};

export default controllers;
