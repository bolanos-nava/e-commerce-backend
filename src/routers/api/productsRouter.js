import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

const router = Router();

router.get('/', controllers.products.list);
router.post('/', controllers.products.create);

router.get('/:productId', controllers.products.show);
router.put('/:productId', controllers.products.update);
router.delete('/:productId', controllers.products.delete);

export const productsRouter = {
  basePath: '/products',
  router,
};
