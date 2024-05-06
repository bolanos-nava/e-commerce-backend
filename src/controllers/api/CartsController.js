/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import { Cart, Product } from '../../daos/models/index.js';

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
      actions: this.removeProduct.bind(this),
    },
  ];

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
  async removeProduct(req, res, next) {
    try {
      const { cartId, productId } = req.params;
      await Cart.updateOne(
        { _id: cartId },
        {
          $pull: {
            products: {
              product: productId,
            },
          },
        },
      );

      res.json({
        status: 'deleted',
        payload: {
          cartId,
          removedProduct: productId,
        },
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

      let { quantity } = req.body;
      quantity = Number(quantity);
      if (Number.isNaN(quantity) || !quantity) {
        quantity = 1;
      }

      await Cart.findByIdAndThrow(cartId);
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return this.removeProduct(req, res, next);
      }
      // await Product.findByIdAndThrow(productId);

      const matchingProduct = await Cart.findProductInCart(cartId, productId);
      let updatedResponse;

      if (!matchingProduct) {
        updatedResponse = await Cart.findOneAndUpdate(
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
        const { products } = updatedResponse;
        // Returns the newly added product in the response
        updatedResponse = products[products.length - 1];
      } else {
        // Delete product if new quantity will be less than 0
        if (matchingProduct.quantity + quantity <= 0) {
          return this.removeProduct(req, res, next);
        }

        // The positional operator in 'products.$.quantity' is telling Mongoose to select the first element in the array of products that matches the query. In this case, the query looks for the cart with id == cartId that has a product with id == productId. So, the positional operator is selecting the matched product only, and then selects its "quantity" field and updates it.
        await Cart.updateOne(
          { _id: cartId, 'products.product': productId },
          { $inc: { 'products.$.quantity': quantity } },
        );

        // Finds the updated product
        const updatedProduct = await Cart.findOne(
          { 'products._id': matchingProduct._id },
          { 'products.$': 1 },
        );
        [updatedResponse] = updatedProduct.products;
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
