import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import {
  authorize,
  logHttp,
  passportStrategyErrorWrapper,
  updateLastActiveAtMiddleware,
} from '../../middlewares/index.js';

const router = Router();

/* ****************************** */
// PATH /
router
  .route('/') // path
  .post(
    logHttp('Creating new cart'),
    authorize('user', 'user_premium', 'anon'),
    updateLastActiveAtMiddleware(),
    controllers.carts.create.bind(controllers.carts),
  );

/* ****************************** */
// PATH /:cartId
router
  .route('/:cartId') // path
  .get(
    logHttp('Showing cart'),
    authorize('user', 'user_premium', 'anon'),
    controllers.carts.show.bind(controllers.carts),
  );

/* ****************************** */
// PATH /:cartId/products
router
  .route('/:cartId/products') // path
  .post(
    // POST because NOT idempotent
    logHttp('Adding array of products to cart'),
    authorize('user', 'user_premium'),
    controllers.carts.addProductsToCart.bind(controllers.carts),
  )
  .delete(
    logHttp('Removing products from cart'),
    authorize('user', 'user_premium', 'anon'),
    controllers.carts.removeProducts.bind(controllers.carts),
  );

/* ****************************** */
// PATH /:cartId/products/:productId
router
  .route('/:cartId/products/:productId') // path
  .post(
    // POST because not idempotent adds new products and increments quantity in others
    logHttp('Adding product to cart'),
    authorize('user', 'user_premium', 'anon'),
    controllers.carts.addProductToCart.bind(controllers.carts),
  )
  .put(
    // PUT because idempotent, updates quantity in absolute manner
    logHttp('Updating product quantity in cart'),
    authorize('user', 'user_premium', 'anon'),
    controllers.carts.setProductQuantity.bind(controllers.carts),
  )
  .delete(
    logHttp('Removing product from cart'),
    authorize('user', 'user_premium', 'anon'),
    controllers.carts.removeProduct.bind(controllers.carts),
  );

/* ****************************** */
// PATH /:cartId/tickets
router
  .route('/:cartId/tickets') // path
  .post(
    logHttp('Creating ticket from cart'),
    authorize('user', 'user_premium'),
    controllers.carts.createTicket.bind(controllers.carts),
  );

export const cartsRouter = {
  basePath: '/carts',
  router,
};
