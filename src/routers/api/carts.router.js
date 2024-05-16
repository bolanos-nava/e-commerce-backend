import { Router } from 'express';
import apiControllers from '../../controllers/api/index.js';

const _cartsRouter = Router();

const { carts } = apiControllers;

_cartsRouter.post('/', carts.createCart);

_cartsRouter.get('/:cartId', carts.showCart);
_cartsRouter.put('/:cartId', carts.addProductsToCart);
_cartsRouter.delete('/:cartId', carts.removeAllProducts);

// _cartsRouter.delete('/:cartId/products', carts.removeAllProducts);
// _cartsRouter.post('/:cartId/products', carts.addProductsToCart);

_cartsRouter.post('/:cartId/products/:productId', carts.addOneProductToCart);
_cartsRouter.put('/:cartId/products/:productId', carts.updateProductQuantity);
_cartsRouter.delete('/:cartId/products/:productId', carts.removeOneProduct);

export const cartsRouter = {
  basePath: '/carts',
  router: _cartsRouter,
};
