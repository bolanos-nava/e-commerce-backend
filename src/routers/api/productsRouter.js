import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize, logHttp } from '../../middlewares/index.js';

const router = Router();

/* ****************************** */
// PATH /
router
  .route('/') // path
  .get(logHttp('Listing products'), controllers.products.list)
  .post(
    logHttp('Creating new product'),
    // authorize('admin'),
    controllers.products.create,
  );

/* ****************************** */
// PATH /:productId
router
  .route('/:productId') // path
  .get(logHttp('Showing product'), controllers.products.show)
  .put(
    logHttp('Updating product'),
    authorize('admin'),
    controllers.products.update,
  )
  .delete(
    logHttp('Delete products'),
    authorize('admin'),
    controllers.products.delete,
  );

export const productsRouter = {
  basePath: '/products',
  router,
};
