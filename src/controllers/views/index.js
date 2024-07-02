import ProductsViewsController from './ProductsViewsController.js';
import CartsViewsController from './CartsViewsController.js';
import MessagesViewsController from './MessagesViewsController.js';
import SessionViewsController from './SessionViewsController.js';

const viewsControllers = {
  productsViews: new ProductsViewsController(),
  cartsViews: new CartsViewsController(),
  messagesViews: new MessagesViewsController(),
  sessionViews: new SessionViewsController(),
};

export default viewsControllers;
