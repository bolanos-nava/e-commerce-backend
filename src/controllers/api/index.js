import CartsController from './CartsController.js';
import MessagesController from './MessagesController.js';
import ProductsController from './ProductsController.js';

const apiControllers = {
  products: new ProductsController(),
  carts: new CartsController(),
  messages: new MessagesController(),
};

export default apiControllers;
