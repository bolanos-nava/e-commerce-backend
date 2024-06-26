import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

const _cartsRouter = Router();

_cartsRouter.post('/', controllers.carts.create);

_cartsRouter.get('/:cartId', controllers.carts.show);
_cartsRouter.put('/:cartId', controllers.carts.addProductsToCart);
_cartsRouter.delete('/:cartId', controllers.carts.removeProducts);

// _cartsRouter.delete('/:cartId/products', controllers.carts.removeAllProducts);
// _cartsRouter.post('/:cartId/products', controllers.carts.addProductsToCart);

_cartsRouter.post(
  '/:cartId/products/:productId',
  controllers.carts.addProductToCart,
);
_cartsRouter.put(
  '/:cartId/products/:productId',
  controllers.carts.updateProductQuantity,
);
_cartsRouter.delete(
  '/:cartId/products/:productId',
  controllers.carts.removeProduct,
);

export const cartsRouter = {
  basePath: '/carts',
  router: _cartsRouter,
};
