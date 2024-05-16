import ProductsViewsController from './ProductsViewsController.js';
import CartsViewsController from './CartsViewsController.js';
import MessagesViewsController from './MessagesViewsController.js';

const viewsControllers = {
  productsViews: new ProductsViewsController(),
  cartsViews: new CartsViewsController(),
  messagesViews: new MessagesViewsController(),
};

export default viewsControllers;
