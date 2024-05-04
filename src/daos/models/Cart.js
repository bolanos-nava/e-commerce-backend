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
          },
        },
      ],
    },
  }),
};

class CartModel extends BaseModel {
  static async findProductInCart(cartId, productId) {
    const matchingProducts = await this.findOne(
      {
        _id: cartId,
        'products.product': productId,
      },
      { 'products.$': 1 },
    );

    return matchingProducts?.products[0];
  }
}

/** @type {ICartModel} */
export const Cart = model(
  cartSchema.name,
  cartSchema.schema.loadClass(CartModel),
);
