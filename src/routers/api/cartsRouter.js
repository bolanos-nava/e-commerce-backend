import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize, logHttp } from '../../middlewares/index.js';

const router = Router();

/* ****************************** */
// PATH /
router
  .route('/') // path
  .post(logHttp('Creating new cart'), controllers.carts.create);

/* ****************************** */
// PATH /:cartId
router
  .route('/:cartId') // path
  .get(logHttp('Showing cart'), controllers.carts.show);

/* ****************************** */
// PATH /:cartId/products
router
  .route('/:cartId/products') // path
  .post(
    logHttp('Adding product to cart'),
    authorize('user'),
    controllers.carts.addProductsToCart,
  ) // POST because NOT idempotent
  .delete(
    logHttp('Removing products from cart'),
    controllers.carts.removeProducts,
  );

/* ****************************** */
// PATH /:cartId/tickets
router
  .route('/:cartId/tickets') // path
  .post(
    logHttp('Creating ticket from cart'),
    authorize('user'),
    controllers.carts.createTicket,
  );

/* ****************************** */
// PATH /:cartId/products/:productId
router
  .route('/:cartId/products/:productId') // path
  .post(
    // POST because not idempotent adds new products and increments quantity in others
    logHttp('Adding product to cart'),
    authorize('user', 'anon'),
    controllers.carts.addProductToCart,
  )
  .put(
    // PUT because idempotent, updates quantity in absolute manner
    logHttp('Updating product quantity in cart'),
    controllers.carts.setProductQuantity,
  )
  .delete(
    logHttp('Removing product from cart'),
    controllers.carts.removeProduct,
  );

router
  .route('/:cartId/tickets') // path
  .post(authorize('user'), controllers.carts.createTicket);

export const cartsRouter = {
  basePath: '/carts',
  router,
};
