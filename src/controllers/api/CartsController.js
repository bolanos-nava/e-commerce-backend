/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import services from '../../services/index.js';
import { cartValidator } from '../../schemas/zod/cart.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */
export default class CartsController extends BaseController {
  /**
   * Creates a new cart
   * @type {ExpressType['RequestHandler']}
   */
  async createCart(req, res, next) {
    try {
      const savedResponse = await services.carts.saveCart();

      res.status(201).json({
        status: 'created',
        payload: {
          cart: {
            _id: savedResponse.id,
            products: [],
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns data of a single cart
   * @type {ExpressType['RequestHandler']}
   */
  async showCart(req, res, next) {
    try {
      const { cartId } = req.params;

      const cart = await services.carts.getCart(cartId);

      res.json({
        status: 'success',
        payload: {
          cart: {
            _id: cartId,
            products: cart.products,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes all products from a cart
   * @type {ExpressType['RequestHandler']}
   */
  async removeAllProducts(req, res, next) {
    try {
      const { cartId } = req.params;

      await services.carts.removeAllProducts(cartId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates products in a cart
   * @type {ExpressType['RequestHandler']}
   */
  async addProduct(req, res, next) {
    try {
      const { cartId, productId } = req.params;

      let { quantity = 1 } = req.body;
      quantity = Math.abs(Number.parseInt(quantity, 10));
      if (!quantity || Number.isNaN(quantity)) {
        quantity = 1;
      }

      const addedResponse = await services.carts.addProductToCart(
        cartId,
        productId,
        quantity,
      );

      let responseToSend = res;
      if (addedResponse.type === 'push') {
        responseToSend = responseToSend.status(201);
      }
      responseToSend.json(addedResponse.cart);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates product quantity
   * @type {ExpressType['RequestHandler']}
   */
  async updateProductQuantity(req, res, next) {
    try {
      const { cartId, productId } = req.params;
      let { quantity = 1 } = req.body;
      quantity = cartValidator.parse({ quantity }).quantity;

      if (Number.isNaN(quantity) || typeof quantity === 'undefined') {
        quantity = 1;
      }

      const updatedResponse = await services.carts.updateProductQuantity(
        cartId,
        productId,
        quantity,
      );

      res.json({
        status: 'updated',
        payload: {
          cart: updatedResponse,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes product from a cart
   * @type {ExpressType['RequestHandler']}
   */
  async removeOneProduct(req, res, next) {
    try {
      const { cartId, productId } = req.params;

      await services.carts.removeOneProduct(cartId, productId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
