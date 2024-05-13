/* eslint-disable class-methods-use-this */
import { Schema, Types } from 'mongoose';
import { Cart } from '../daos/models/index.js';

export class CartsService {
  /**
   * Saves a cart to the database
   *
   * @returns Response after save
   */
  async saveCart() {
    const cart = new Cart();
    return cart.save();
  }

  async getCart(cartId) {
    const cartAggregation = await Cart.aggregate([
      {
        $match: { _id: new Types.ObjectId(cartId) },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                $mergeObjects: [
                  '$$product',
                  {
                    product: {
                      $arrayElemAt: [
                        '$productDetails',
                        {
                          $indexOfArray: ['$products', '$$product'],
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unset: ['productDetails'],
      },
      {
        $addFields: {
          products: {
            $filter: {
              input: '$products',
              as: 'product',
              cond: {
                $eq: [{ $type: '$$product.product' }, 'object'],
                // $ne: ['$$product', null],
              },
            },
          },
        },
      },
      // {
      //   $redact: {
      //     $cond: {
      //       if: {
      //         $eq: [{ $type: '$product' }, 'object'],
      //       },
      //       then: '$$DESCEND',
      //       else: '$$PRUNE',
      //     },
      //   },
      // },
    ]);

    console.log('cartAgg', cartAggregation[0]);
    console.log('cartAgg prods', cartAggregation[0].products);

    return cartAggregation[0];
  }
}
