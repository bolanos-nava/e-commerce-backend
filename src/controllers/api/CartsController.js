/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import { cartValidator } from '../../schemas/zod/cart.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 * @typedef {import('../../types').ServicesType['carts']} CartsServiceType
 */
export default class CartsController extends BaseController {
  /** @type CartsServiceType */
  #cartsService;

  /**
   * Constructs a new carts controller
   *
   * @param {CartsServiceType} cartsService - Carts service instance
   */
  constructor(cartsService) {
    super();
    this.#cartsService = cartsService;
  }

  /**
   * Creates a new cart
   *
   * @type {ExpressType['RequestHandler']}
   */
  createCart = async (req, res, next) => {
    try {
      const savedResponse = await this.#cartsService.saveNewCart();

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
  };

  /**
   * Returns data of a single cart
   *
   * @type {ExpressType['RequestHandler']}
   */
  showCart = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      const cart = await this.#cartsService.getCart(cartId);

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
  };

  /**
   * Removes all products from a cart
   *
   * @type {ExpressType['RequestHandler']}
   */
  removeAllProducts = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      await this.#cartsService.removeAllProducts(cartId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Adds a product to a cart. If the product exists, it increases its quantity
   *
   * @type {ExpressType['RequestHandler']}
   */
  addOneProductToCart = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      let { quantity = 1 } = req.body;
      quantity = Math.abs(Number.parseInt(quantity, 10));
      if (!quantity || Number.isNaN(quantity)) {
        quantity = 1;
      }

      const addedResponse = await this.#cartsService.addOneProductToCart(
        cartId,
        productId,
        quantity,
      );

      let responseToSend = res;
      if (addedResponse.type === 'push') {
        responseToSend = responseToSend.status(201);
      }
      responseToSend.json({
        status: 'updated',
        payload: { cart: addedResponse.cart },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Adds an array of products to a cart. Pushes the ones which don't exist and increases the quantity of the ones which exist.
   *
   *
   * @type {ExpressType['RequestHandler']}
   */
  addProductsToCart = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      const { products } = req.body;

      const addedResponse = await this.#cartsService.addProductsToCart(
        cartId,
        products,
      );

      res.json({
        status: 'updated',
        payload: { cart: addedResponse },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Changes the quantity of a product in a cart. It is an idempotent operation
   *
   * @type {ExpressType['RequestHandler']}
   */
  updateProductQuantity = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      let { quantity = 1 } = req.body;
      quantity = cartValidator.parse({ quantity }).quantity;

      if (Number.isNaN(quantity) || typeof quantity === 'undefined') {
        quantity = 1;
      }

      const updatedResponse = await this.#cartsService.updateProductQuantity(
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
  };

  /**
   * Removes a product from a cart
   *
   * @type {ExpressType['RequestHandler']}
   */
  removeOneProduct = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      await this.#cartsService.removeOneProduct(cartId, productId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
