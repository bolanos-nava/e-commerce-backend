import ProductsViewsController from './ProductsViewsController.js';
import CartsViewsController from './CartsViewsController.js';
import MessagesViewsController from './MessagesViewsController.js';
import SessionViewsController from './SessionViewsController.js';
// Dependencies to inject
import services from '../../services/index.js';

const viewsControllers = {
  productsViews: new ProductsViewsController(services.products),
  cartsViews: new CartsViewsController(services.carts),
  messagesViews: new MessagesViewsController(services.messages),
  sessionViews: new SessionViewsController(),
};

export default viewsControllers;
