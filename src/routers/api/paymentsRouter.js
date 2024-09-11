import { Router } from 'express';
import { ResourceNotFoundError } from '../../customErrors/index.js';

const router = Router();

const MOCK_CART = Object.freeze([
  { id: 1, name: 'papas', price: 1000 },
  { id: 2, name: 'queso', price: 500 },
  { id: 3, name: 'hamburguesa', price: 1500 },
  { id: 4, name: 'soda', price: 1000 },
  { id: 5, name: 'golosinas', price: 800 },
]);

/* ****************************** */
// PATH /
router
  .route('/payment-intents') // path
  .post(async (req, res, next) => {
    try {
      const productRequested = MOCK_CART.find(
        (p) => p.id === Number(req.query.productId),
      );

      if (!productRequested) {
        throw new ResourceNotFoundError('Product not found');
      }

      const paymentIntentInfo = {
        amount: productRequested.price,
        currenty: 'usd',
      };
    } catch (error) {
      next(error);
    }
  });

export const paymentsRouter = {
  basePath: '/payments',
  router,
};
