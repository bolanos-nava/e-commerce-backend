/* eslint-disable class-methods-use-this */
import BaseController from '../BaseController.js';
import { Cart } from '../../models/index.js';
import { Types } from 'mongoose';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').CartType} CartType
 * @typedef {import('../../types').CartProduct} CartProduct
 * @typedef {import('../../types').UUIDType} UUIDType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */
export default class CartsController extends BaseController {
  /** @type {ControllerRoute} */
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
      // const { products } = await this.cart.getCartById(cartId);
      const { products } = await Cart.findById(cartId).populate('products');
      console.log({ products });
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
      /** @type {{cartId: UUIDType, productId: UUIDType}} */
      const { cartId, productId } = req.params;

      const matchingProduct = await Cart.findProductById(cartId, productId);

      let updatedResponse;
      if (!matchingProduct) {
        updatedResponse = await Cart.updateOne(
          { _id: cartId },
          {
            $push: {
              products: {
                product: productId,
                quantity: 1,
              },
            },
          },
        );
      } else {
        updatedResponse = await Cart.updateOne(
          { _id: cartId, 'products.product': productId },
          {
            'products.$.quantity': matchingProduct.quantity + 1,
          },
        );
      }

      res.json({
        status: 'updated',
        payload: updatedResponse,
      });

      //   const { quantity } = req.body;

      // const product = new Product();

      // // Checks if product exists. Throws error if doesn't
      // await product.getProductById(productId);

      // const { products: cartProducts } = await this.cart.getCartById(cartId);

      // const productToUpdateIdx = cartProducts.findIndex(
      //   ({ product: prodId }) => prodId === productId,
      // );

      // /** @type {CartProduct} */
      // const newProduct = {
      //   product: productId,
      //   quantity: 1,
      // };

      // /** @type {CartProduct[]} */
      // let newCartProducts;
      // if (productToUpdateIdx === -1) {
      //   cartProducts.push(newProduct);
      //   newCartProducts = cartProducts;
      // } else {
      //   const { quantity: oldQuantity } = cartProducts[productToUpdateIdx];
      //   const { quantity: newQuantity } = newProduct;
      //   newProduct.quantity = oldQuantity + newQuantity;
      //   newCartProducts = [
      //     ...cartProducts.slice(0, productToUpdateIdx),
      //     newProduct,
      //     ...cartProducts.slice(productToUpdateIdx + 1),
      //   ];
      // }

      // /** @type {CartType} */
      // const newCart = {
      //   id: cartId,
      //   products: newCartProducts,
      // };
      // const updatedCart = await this.cart.updateCart(cartId, newCart);
      // res.json({
      //   status: 'updated',
      //   payload: updatedCart,
      // });
    } catch (error) {
      next(error);
    }
  }
}
