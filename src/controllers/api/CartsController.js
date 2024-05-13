/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { Schema, Types } from 'mongoose';
import BaseController from './BaseController.js';
import { Cart, Product } from '../../daos/models/index.js';
import { ResourceNotFoundError } from '../../customErrors/ResourceNotFoundError.js';
import services from '../../services/index.js';

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
      // const cart = new Cart();
      // await cart.save();

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

      const { products } = await services.carts.getCart(cartId);

      res.json({
        status: 'success',
        payload: {
          cart: {
            _id: cartId,
            products,
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

      await Cart.removeAllProducts(cartId);

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

      let { quantity } = req.body;
      quantity = Number(quantity);
      if (Number.isNaN(quantity) || !quantity) {
        quantity = 1;
      }

      const product = await Product.findById(productId);
      const productInCart = await Cart.findProductInCart(cartId, productId);
      const newQuantity = productInCart
        ? productInCart.quantity + quantity
        : quantity;

      // if ((!product && productInCart) || newQuantity <= 0) {
      //   await Cart.removeOneProduct(cartId, productId);
      //   const response = this.#responses.deleteOneProduct(cartId, productId);
      //   return res.json(response);
      // }
      if (!product) {
        return next(
          new ResourceNotFoundError(`Product with ${productId} not found`),
        );
      }
      if (!product.status) {
        return next(
          new ResourceNotFoundError(`Product with ${productId} unavailable`, {
            status: 403,
          }),
        );
      }
      if (!productInCart) {
        await Cart.updateOne(
          { _id: cartId },
          {
            $push: {
              products: {
                product: productId,
                quantity,
              },
            },
          },
          { runValidators: true, upsert: true },
        );

        return res.status(201).json({
          status: 'updated',
          payload: {
            cart: {
              _id: cartId,
              product: productId,
              quantity,
            },
          },
        });
      }

      await Cart.updateOne(
        {
          _id: cartId,
          'products.product': productId,
        },
        {
          $inc: {
            'products.$.quantity': quantity,
          },
        },
      );

      res.json({
        status: 'updated',
        payload: {
          cart: {
            _id: cartId,
            product: productId,
            quantity: newQuantity,
          },
        },
      });
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
      let { quantity } = req.body;
      console.log(quantity, typeof quantity);
      quantity = Number(quantity);
      if (Number.isNaN(quantity) || typeof quantity === 'undefined') {
        quantity = 1;
      }

      const productInCart = await Cart.findProductInCart(cartId, productId);
      if (!productInCart) {
        return next(
          new ResourceNotFoundError(
            `Product with id ${productId} not in cart with id ${cartId}`,
          ),
        );
      }

      const product = await Product.exists({ _id: productId });

      // if (!product || quantity <= 0) {
      //   await Cart.removeOneProduct(cartId, productId);
      //   const response = this.#responses.deleteOne(cartId, productId);
      //   return res.json(response);
      // }

      await Cart.updateOne(
        {
          _id: cartId,
          'products.product': productId,
        },
        {
          'products.$.quantity': quantity,
        },
      );

      res.json({
        status: 'updated',
        payload: {
          cart: cartId,
          product: productId,
          quantity,
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

      await Cart.removeOneProduct(cartId, productId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
