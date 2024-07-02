import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

const _productsRouter = Router();

_productsRouter.get('/', controllers.products.list);
_productsRouter.post('/', controllers.products.create);

_productsRouter.get('/:productId', controllers.products.show);
_productsRouter.put('/:productId', controllers.products.update);
_productsRouter.delete('/:productId', controllers.products.delete);

export const productsRouter = {
  basePath: '/products',
  router: _productsRouter,
};
