import { Router } from 'express';
import { CartsManager } from '../controllers/index.js';

export const cartsRouter = Router();

cartsRouter.use((req, res, next) => {
  req.cartsManager = new CartsManager(`${import.meta.dirname}/../carts.json`);
  next();
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