import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize } from '../../middlewares/index.js';

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
  .route('/:cartId/products/:productId') // path
  .post(authorize('user', 'anon'), controllers.carts.addProductToCart)
  .put(controllers.carts.setProductQuantity) // PUT because idempotent
  .delete(controllers.carts.removeProduct);

router
  .route('/:cartId/tickets') // path
  .post(authorize('user'), controllers.carts.createTicket);

export const cartsRouter = {
  basePath: '/carts',
  router,
};

// _cartsRouter.put('/:cartId', controllers.carts.addProductsToCart);
// _cartsRouter.delete('/:cartId', controllers.carts.removeProducts);
