import { Router } from 'express';
import controllers from '../../controllers/api/index.js';

export const cartsRouter = Router();

controllers.cartsController.addRoutes(cartsRouter);

// cartsRouter.use((req, res, next) => {
//   req.cartsManager = new Cart(`${path.resolve()}/src/carts.json`);
//   next();
// });

// cartsRouter.post('/', async (req, res, next) => {
//   try {
//     const newCart = await req.cartsManager.createCart();
//     res.status(201).send({
//       status: 'created',
//       payload: newCart,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// cartsRouter.get('/:cartId', async (req, res, next) => {
//   try {
//     const { cartId } = req.params;

//     const cart = await req.cartsManager.getCartById(cartId);
//     res.send({
//       status: 'success',
//       payload: cart,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// cartsRouter.post('/:cartId/products/:productId', async (req, res, next) => {
//   try {
//     const { cartId, productId } = req.params;
//     //   const { quantity } = req.body;
//     const newCart = await req.cartsManager.addToCart(cartId, {
//       product: productId,
//       quantity: 1,
//     });
//     res.send({
//       status: 'updated',
//       payload: newCart,
//     });
//   } catch (error) {
//     next(error);
//   }
// });
