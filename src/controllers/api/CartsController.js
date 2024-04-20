import path from 'node:path';
import { Cart } from '../../models/index.js';
import BaseController from '../BaseController.js';

export default class CartsController extends BaseController {
  cart = new Cart(`${path.resolve()}/src/carts.json`);

  /**
   * Adds actions and sets up routes in the router
   * @param {Router} router
   */
  addRoutes(router) {
    this.actions.push(
      ...[
        {
          spec: {
            path: '/',
            method: 'POST',
          },
          action: this.create.bind(this),
        },
        {
          spec: {
            path: '/:productId',
            method: 'GET',
          },
          action: this.show.bind(this),
        },
        {
          spec: {
            path: '/:cartId/products/:productId',
            method: 'POST',
          },
          action: this.update.bind(this),
        },
      ],
    );

    // Adds the actions to the router
    this.setupActions(router);
  }

  /**
   * Creates a new cart
   */
  async create(req, res, next) {
    try {
      const newCart = await this.cart.createCart();
      res.status(201).json({
        status: 'created',
        payload: newCart,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns data of a single cart
   */
  async show(req, res, next) {
    try {
      const { cartId } = req.params;
      const cart = await this.cart.getCartById(cartId);
      res.json({
        status: 'success',
        payload: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates products in a cart
   */
  async update(req, res, next) {
    try {
      const { cartId, productId } = req.params;
      //   const { quantity } = req.body;
      const newCart = await this.cart.addToCart(cartId, {
        product: productId,
        quantity: 1,
      });
      res.json({
        status: 'updated',
        payload: newCart,
      });
    } catch (error) {
      next(error);
    }
  }
}
