import { Router } from 'express';
import controllers from '../../controllers/api/index.js';
import { authorize } from '../../middlewares/index.js';

const router = Router();

router
  .route('/')
  .get(controllers.products.list)
  .post(authorize('admin'), controllers.products.create);

router
  .route('/:productId')
  .get(controllers.products.show)
  .put(authorize('admin'), controllers.products.update)
  .delete(authorize('admin'), controllers.products.delete);

export const productsRouter = {
  basePath: '/products',
  router,
};
