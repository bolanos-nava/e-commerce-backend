import { Schema, model, Types } from 'mongoose';
import BaseModel from './BaseModel.js';

/**
 * @typedef {import('../../types').ICartModel} ICartModel
 */

const cartSchema = {
  name: 'Cart',
  schema: new Schema({
    products: {
      type: [
        {
          product: {
            type: Types.ObjectId,
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
  }),
};

class CartModel extends BaseModel {
  static async findProductInCart(cartId, productId) {
    const matchingCart = await this.findOne(
      { _id: cartId, 'products.product': productId },
      { 'products.$': 1 }, // will project the products array with only the first element that matches the query condition, in this case, the product with id productId in the cart with id cartId
    );

    return matchingCart?.products[0];
  }
}

/** @type {ICartModel} */
export const Cart = model(
  cartSchema.name,
  cartSchema.schema.loadClass(CartModel),
);
