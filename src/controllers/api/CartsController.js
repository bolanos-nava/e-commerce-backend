import { Cart, Product } from '../../models/index.js';
import BaseController from '../BaseController.js';

export default class CartsController extends BaseController {
  cart = new Cart();

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
            path: '/:cartId',
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
      const { products } = await this.cart.getCartById(cartId);
      res.json({
        status: 'success',
        payload: products,
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

      const product = new Product();

      // Checks if product exists. Throws error if doesn't
      await product.getProductById(productId);

      const cartProducts = await this.cart.getCartProducts(cartId);

      const productToUpdateIdx = cartProducts.findIndex(
        ({ product: prodId }) => prodId === productId,
      );

      const newProduct = {
        product: productId,
        quantity: 1,
      };
      let newCartProducts;
      if (productToUpdateIdx === -1) {
        cartProducts.push(newProduct);
        newCartProducts = cartProducts;
      } else {
        const { quantity: oldQuantity } = cartProducts[productToUpdateIdx];
        const { quantity: newQuantity } = newProduct;
        newProduct.quantity = oldQuantity + newQuantity;
        newCartProducts = [
          ...cartProducts.slice(0, productToUpdateIdx),
          newProduct,
          ...cartProducts.slice(productToUpdateIdx + 1),
        ];
      }

      const newCart = {
        id: cartId,
        products: newCartProducts,
      };
      const updatedCart = await this.cart.updateCart(cartId, newCart);

      res.json({
        status: 'updated',
        payload: updatedCart,
      });
    } catch (error) {
      next(error);
    }
  }
}
