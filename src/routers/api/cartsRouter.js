import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import {
  authorize,
  passportStrategyErrorWrapper,
} from '../../middlewares/index.js';

const router = Router();

router
  .route('/') // path
  .post(controllers.carts.create);

router
  .route('/:cartId') // path
  .get(controllers.carts.show);

router
  .route('/:cartId/products') // path
  .post(authorize('user'), controllers.carts.addProductsToCart) // POST because NOT idempotent
  .delete(controllers.carts.removeProducts);

router
  .route('/:cartId/tickets') // path
  .post(passportStrategyErrorWrapper('jwt'), controllers.carts.createTicket);

router
  .route('/:cartId/products/:productId') // path
  .post(authorize('user'), controllers.carts.addProductToCart)
  .put(controllers.carts.updateProductQuantity) // PUT because idempotent
  .delete(controllers.carts.removeProduct);

export const cartsRouter = {
  basePath: '/carts',
  router,
};

// _cartsRouter.put('/:cartId', controllers.carts.addProductsToCart);
// _cartsRouter.delete('/:cartId', controllers.carts.removeProducts);
