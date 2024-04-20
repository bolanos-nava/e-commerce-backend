import CartsController from './CartsController.js';
import ProductsController from './ProductsController.js';

const controllers = {
  productsController: new ProductsController(),
  cartsController: new CartsController(),
};

export default controllers;
