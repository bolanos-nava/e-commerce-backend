/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import { Cart, Product } from '../../daos/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */
export default class CartsController extends BaseController {
  /** @type {ControllerRoute[]} */
  routes = [
    {
      path: '/',
      httpMethod: 'POST',
      actions: this.create.bind(this),
    },
    {
      path: '/:cartId',
      httpMethod: 'GET',
      actions: this.show.bind(this),
    },
    {
      path: '/:cartId/products/:productId',
      httpMethod: 'POST',
      actions: this.update.bind(this),
    },
  ];

  /** Creates a new cart
   * @type {ExpressType['RequestHandler']}
   */
  async create(req, res, next) {
    try {
      const cart = new Cart();
      await cart.save();
      res.status(201).json({
        status: 'created',
        payload: {
          id: cart.id,
          products: [],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /** Returns data of a single cart
   * @type {ExpressType['RequestHandler']}
   */
  async show(req, res, next) {
    try {
      const { cartId } = req.params;
      const { products } = await Cart.findById(cartId);
      res.json({
        status: 'success',
        payload: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /** Updates products in a cart
   * @type {ExpressType['RequestHandler']}
   */
  async update(req, res, next) {
    try {
      const { cartId, productId } = req.params;

      await Cart.findByIdAndThrow(cartId);
      await Product.findByIdAndThrow(productId);

      // TODO: add logic to add quantities different than one
      const matchingProduct = await Cart.findProductInCart(cartId, productId);
      let updatedResponse;
      if (!matchingProduct) {
        updatedResponse = await Cart.findOneAndUpdate(
          { _id: cartId },
          {
            $push: {
              products: {
                product: productId,
                quantity: 1,
              },
            },
          },
          { new: true },
        );
      } else {
        updatedResponse = await Cart.findOneAndUpdate(
          { _id: cartId, 'products.product': productId },
          {
            'products.$.quantity': matchingProduct.quantity + 1,
          },
          { new: true },
        );
      }

      res.json({
        status: 'updated',
        payload: updatedResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
