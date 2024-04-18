import path from 'node:path';
import { Router } from 'express';
import { CartsManager } from '../../models/index.js';

export const cartsRouter = Router();

cartsRouter.use((req, res, next) => {
  req.cartsManager = new CartsManager(`${path.resolve()}/src/carts.json`);
  next();
});

cartsRouter.route('/').post(async (req, res, next) => {
  try {
    const newCart = await req.cartsManager.createCart();
    res.status(201).send({
      status: 'created',
      payload: newCart,
    });
  } catch (error) {
    next(error);
  }
});

cartsRouter.route('/:cartId').get(async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const cart = await req.cartsManager.getCartById(cartId);
    res.send({
      status: 'success',
      payload: cart,
    });
  } catch (error) {
    next(error);
  }
});

cartsRouter
  .route('/:cartId/products/:productId')
  .post(async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      //   const { quantity } = req.body;
      const newCart = await req.cartsManager.addToCart(cartId, {
        product: productId,
        quantity: 1,
      });
      res.send({
        status: 'updated',
        payload: newCart,
      });
    } catch (error) {
      next(error);
    }
  });
