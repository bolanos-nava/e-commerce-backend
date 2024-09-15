import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize, logHttp } from '../../middlewares/index.js';

const router = Router();

/* ****************************** */
// PATH /
router
  .route('/') // path
  .get(
    logHttp('Listing products'),
    controllers.products.list.bind(controllers.products),
  )
  .post(
    logHttp('Creating new product'),
    authorize('admin', 'user_premium'),
    controllers.products.create.bind(controllers.products),
  );

/* ****************************** */
// PATH /:productId
router
  .route('/:productId') // path
  .get(
    logHttp('Showing a product'),
    controllers.products.show.bind(controllers.products),
  )
  .put(
    logHttp('Updating a product'),
    authorize('admin', 'user_premium'),
    controllers.products.update.bind(controllers.products),
  )
  .delete(
    logHttp('Deleting a product'),
    authorize('admin', 'user_premium'),
    controllers.products.delete.bind(controllers.products),
  );

export const productsRouter = {
  basePath: '/products',
  router,
};
