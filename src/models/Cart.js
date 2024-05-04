import { Schema, model, Types } from 'mongoose';
// import { productSchema } from '../schemas/mongoose/index.js';
import { getProductValidator } from '../schemas/zod/product.validator.js';
import BaseModel from './BaseModel.js';

// const { name, schema } = productSchema;

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
  static async findProductById(cartId, productId) {
    // const products = await model('Cart')
    //   .findById(cartId)
    //   .populate({
    //     path: 'products',
    //     match: {
    //       product: productId,
    //     },
    //   });

    // console.log('products products');
    // console.log(products);
    // console.log('products products');

    const prods = await model('Cart').findOne({
      _id: cartId,
      products: {
        $elemMatch: {
          quantity: 3,
        },
      },
    });
    console.log('prods');
    console.log(prods);
    console.log('prods');

    const matchingProducts = await model('Cart').findOne(
      {
        _id: cartId,
        'products.product': productId,
      },
      { 'products.$': 1 },
    );
    console.log(matchingProducts);
    console.log(matchingProducts?.products);

    return matchingProducts?.products[0];
  }
}

export const Cart = model(
  cartSchema.name,
  cartSchema.schema.loadClass(CartModel),
);
