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
    const cart = await Cart.findByIdAndThrow(cartId);

    const cartPopulated = await cart.populate('products.product');
    console.log('cartPopulated not filtered', cartPopulated.products);

    const cartPopp = await Cart.findOne({
      _id: cartId,
    }).populate({
      path: 'products',
      populate: {
        path: 'product',
        match: {
          status: true,
        },
      },
    });
    console.log('cartPopp', cartPopp, cartPopp.products);

    // const cartPopp = await Cart.findOne({
    //   _id: cartId,
    // }).populate('products.product', {
    //   match: {
    //     status: true,
    //   },
    // });
    // console.log('cartPopp', cartPopp, cartPopp.products);

    const cartAgg = await Cart.aggregate([
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
        $unwind: { path: '$products' },
      },
      {
        $unset: ['productDetail'],
      },
      //   {
      //     $redact: {
      //       $cond: {
      //         if: { $eq: ['$product.status', false] },
      //         then: '$$PRUNE',
      //         else: '$$DESCEND',
      //       },
      //     },
      //   },
      {
        $addFields: {
          products: {
            $filter: {
              input: {
                $cond: {
                  if: {
                    $eq: [{ $type: '$products' }, 'array'],
                  },
                  then: '$products',
                  else: ['$products'],
                },
              },
              as: 'product',
              cond: {
                $ne: ['$$product', null],
              },
            },
          },
        },
      },
      {
        $unwind: { path: '$products' },
      },
    ]);
    console.log(
      cartAgg,
      cart,
      cartAgg.map((cart) => cart.products),
    );
  }
}
