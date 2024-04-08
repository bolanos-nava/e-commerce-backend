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
    res.send(cart);
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
      await req.cartsManager.addToCart(cartId, { id: productId, quantity: 1 });
      res.send('ADDED');
    } catch (error) {
      next(error);
    }
  });

cartsRouter.route('/').post(async (req, res, next) => {
  try {
    const { cartProducts } = req.body;
    await req.cartsManager.createCart(cartProducts);
    res.send('OK');
  } catch (error) {
    next(error);
  }
});
