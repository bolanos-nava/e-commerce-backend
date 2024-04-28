import { Cart } from '../../models/index.js';
import { Product } from '../../daos/filesystem/Product.fs.dao.js';
import BaseController from '../BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').CartType} CartType
 * @typedef {import('../../types').CartProduct} CartProduct
 * @typedef {import('../../types').UUIDType} UUIDType
 */
export default class CartsController extends BaseController {
  cart = new Cart();

  /** @type {BaseController['addRoutes']} */
  addRoutes(router) {
    this.actions.push(
      ...[
        {
          spec: {
            path: '/',
            method: 'POST',
          },
          actions: this.create,
        },
        {
          spec: {
            path: '/:cartId',
            method: 'GET',
          },
          actions: this.show,
        },
        {
          spec: {
            path: '/:cartId/products/:productId',
            method: 'POST',
          },
          actions: this.update,
        },
      ],
    );

    // Adds the actions to the router
    this.setupActions(router);
  }

  /** Creates a new cart
   * @type {ExpressType['RequestHandler']}
   */
  create = async (req, res, next) => {
    try {
      const newCart = await this.cart.createCart();
      res.status(201).json({
        status: 'created',
        payload: newCart,
      });
    } catch (error) {
      next(error);
    }
  };

  /** Returns data of a single cart
   * @type {ExpressType['RequestHandler']}
   */
  show = async (req, res, next) => {
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
  };

  /** Updates products in a cart
   * @type {ExpressType['RequestHandler']}
   */
  update = async (req, res, next) => {
    try {
      /** @type {{cartId: UUIDType, productId: UUIDType}} */
      const { cartId, productId } = req.params;
      //   const { quantity } = req.body;

      const product = new Product();

      // Checks if product exists. Throws error if doesn't
      await product.getProductById(productId);

      const { products: cartProducts } = await this.cart.getCartById(cartId);

      const productToUpdateIdx = cartProducts.findIndex(
        ({ product: prodId }) => prodId === productId,
      );

      /** @type {CartProduct} */
      const newProduct = {
        product: productId,
        quantity: 1,
      };

      /** @type {CartProduct[]} */
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

      /** @type {CartType} */
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
  };
}
