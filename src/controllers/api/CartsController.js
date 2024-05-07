/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import { Cart, Product } from '../../daos/models/index.js';
import { ResourceNotFoundError } from '../../customErrors/ResourceNotFoundError.js';

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
    {
      path: '/:cartId/products/:productId',
      httpMethod: 'DELETE',
      actions: this.deleteOneProduct.bind(this),
    },
  ];

  async #removeProductResponse(cartId, productId) {
    await Cart.removeProduct(cartId, productId);

    return {
      status: 'deleted',
      payload: {
        cartId,
        removedProduct: productId,
      },
    };
  }

  /**
   * Creates a new cart
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

  /**
   * Returns data of a single cart
   * @type {ExpressType['RequestHandler']}
   */
  async show(req, res, next) {
    try {
      const { cartId } = req.params;
      const { products } = await Cart.findByIdAndThrow(cartId);

      res.json({
        status: 'success',
        payload: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes product from cart
   * @type {ExpressType['RequestHandler']}
   */
  async deleteOneProduct(req, res, next) {
    try {
      const { cartId, productId } = req.params;

      const response = await this.#removeProductResponse(cartId, productId);

      res.json(response);
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

      let { quantity } = req.body;
      quantity = Number(quantity);
      if (Number.isNaN(quantity) || !quantity) {
        quantity = 1;
      }

      const productExists = await Product.findById(productId);
      const matchingProduct = await Cart.findProductInCart(cartId, productId);
      if (!productExists && matchingProduct) {
        const response = await this.#removeProductResponse(cartId, productId);
        return res.json(response);
      }
      if (!productExists) {
        return next(
          new ResourceNotFoundError(`Product with ${productId} not found`),
        );
      }
      if (!matchingProduct) {
        const { products } = await Cart.findOneAndUpdate(
          { _id: cartId },
          {
            $push: {
              products: {
                product: productId,
                quantity,
              },
            },
          },
          { new: true, runValidators: true, upsert: true },
        );

        const addedProduct = products[products.length - 1];

        return res.json({
          status: 'updated',
          payload: addedProduct,
        });
      }
      if (matchingProduct.quantity + quantity <= 0) {
        const response = await this.#removeProductResponse(cartId, productId);
        return res.json(response);
      }

      await Cart.updateOne(
        { _id: cartId, 'products.product': productId },
        { $inc: { 'products.$.quantity': quantity } },
      );

      const updatedProduct = {
        product: matchingProduct.product,
        quantity: matchingProduct.quantity + quantity,
      };
      res.json({
        status: 'updated',
        payload: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
}
