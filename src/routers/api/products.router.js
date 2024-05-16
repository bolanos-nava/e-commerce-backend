import { Router } from 'express';
import apiControllers from '../../controllers/api/index.js';

const _productsRouter = Router();

const { products } = apiControllers;

_productsRouter.get('/', products.listProducts);
_productsRouter.post('/', products.createProduct);

_productsRouter.get('/:productId', products.showProduct);
_productsRouter.put('/:productId', products.updateProduct);
_productsRouter.delete('/:productId', products.deleteProduct);

export const productsRouter = {
  basePath: '/products',
  router: _productsRouter,
};
