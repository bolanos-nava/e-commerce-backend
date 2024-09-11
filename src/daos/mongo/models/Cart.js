import { Schema, model } from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';
import BaseModel from './BaseModel.js';

/**
 * @typedef {import('../../../types').ICartModel} ICartModel
 */

const cartSchema = {
  name: 'Cart',
  schema: new Schema(
    {
      products: {
        type: [
          {
            product: {
              type: Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              default: 1,
              min: [1, 'Quantity should be greater than 1'],
            },
          },
        ],
      },
    },
    { timestamps: true },
  ),
};

cartSchema.schema.plugin(paginatePlugin);

class CartModel extends BaseModel {
  static async findProductInCart(cartId, productId, { populate = false } = {}) {
    let matchingCart;
    if (populate) {
      matchingCart = await this.findOne(
        { _id: cartId, 'products.product': productId },
        { 'products.$': 1 }, // will project the products array with only the first element that matches the query condition, in this case, the product with id productId in the cart with id cartId
      ).populate({ path: 'products', populate: { path: 'product' } });
    } else {
      matchingCart = await this.findOne(
        { _id: cartId, 'products.product': productId },
        { 'products.$': 1 }, // will project the products array with only the first element that matches the query condition, in this case, the product with id productId in the cart with id cartId
      );
    }

    return matchingCart?.products[0];
  }

  static async removeOneProduct(cartId, productId) {
    return this.updateOne(
      { _id: cartId },
      {
        $pull: {
          products: {
            product: productId,
          },
        },
      },
    );
  }

  static async removeAllProducts(cartId) {
    return this.updateOne({ _id: cartId }, { products: [] });
  }
}

/** @type {ICartModel} */
export const Cart = model(
  cartSchema.name,
  cartSchema.schema.loadClass(CartModel),
);
