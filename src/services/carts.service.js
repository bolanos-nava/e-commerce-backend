/* eslint-disable class-methods-use-this */
import { Schema, Types } from 'mongoose';
import { Cart, Product } from '../daos/models/index.js';
import { ResourceNotFoundError } from '../customErrors/ResourceNotFoundError.js';

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

  async removeUndefinedProducts(cartId) {
    const undefinedProductsAggregation = await Cart.aggregate([
      {
        // Selects the cart with id == cartId
        $match: { _id: new Types.ObjectId(cartId) },
      },
      {
        // Does a lookup on the products collection and adds them to a field called "existingProducts". This field will have only the products that actually exist in the foreign collection
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'existingProducts',
        },
      },
      {
        // Redefines the field defined in the previous step as only the ids of the existing products
        $addFields: {
          existingProducts: {
            $map: {
              input: '$existingProducts',
              as: 'existingProduct',
              in: '$$existingProduct._id',
            },
          },
        },
      },
      {
        // Does a projection to obtain the products in the cart which are not in the existing products field, which are the products in the cart that no longer exist in the database
        $project: {
          _id: 0,
          undefinedProducts: {
            $filter: {
              input: '$products',
              as: 'product',
              cond: {
                $not: {
                  $in: ['$$product.product', '$existingProducts'],
                },
              },
            },
          },
        },
      },
      {
        // Redefines the field to only save the ids of the undefined products
        $project: {
          _id: 0,
          undefinedProducts: {
            $map: {
              input: '$undefinedProducts',
              as: 'undefinedProduct',
              in: '$$undefinedProduct.product',
            },
          },
        },
      },
    ]);

    if (typeof undefinedProductsAggregation[0] === 'undefined') {
      return null;
    }

    const productsToDelete = undefinedProductsAggregation[0].undefinedProducts;

    if (productsToDelete.length) {
      return Cart.updateOne(
        { _id: cartId },
        {
          $pull: {
            products: {
              product: { $in: productsToDelete },
            },
          },
        },
      );
    }

    return null;
  }

  async getCart(cartId) {
    await this.removeUndefinedProducts(cartId);

    const cart = await Cart.findByIdAndThrow(cartId);
    const cartPopulated = await cart.populate({
      path: 'products',
      populate: {
        path: 'product',
      },
    });
    return cartPopulated;

    // const cartAggregation = await Cart.aggregate([
    //   {
    //     $match: { _id: new Types.ObjectId(cartId) },
    //   },
    //   {
    //     $lookup: {
    //       from: 'products',
    //       localField: 'products.product',
    //       foreignField: '_id',
    //       as: 'productsDetails',
    //     },
    //   },
    //   {
    //     $addFields: {
    //       products: {
    //         $map: {
    //           input: '$products',
    //           as: 'product',
    //           in: {
    //             $mergeObjects: [
    //               '$$product',
    //               {
    //                 product: {
    //                   $arrayElemAt: [
    //                     '$productsDetails',
    //                     {
    //                       $indexOfArray: ['$products', '$$product'],
    //                     },
    //                   ],
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $unset: ['productsDetails'],
    //   },
    // ]);

    // return cartAggregation[0];
  }

  async addProductToCart(cartId, productId, quantity) {
    const product = await Product.findByIdAndThrow(productId);
    const productInCart = await Cart.findProductInCart(cartId, productId);

    if (!product.status) {
      throw new ResourceNotFoundError(`Product with ${productId} unavailable`, {
        status: 403,
      });
    }

    if (!productInCart) {
      await Cart.updateOne(
        { _id: cartId },
        {
          $push: {
            products: {
              product: productId,
              quantity,
            },
          },
        },
        { runValidators: true, upsert: true },
      );

      return {
        type: 'push',
        cart: {
          _id: cartId,
          product: productId,
          quantity,
        },
      };
    }

    await Cart.updateOne(
      {
        _id: cartId,
        'products.product': productId,
      },
      {
        $inc: {
          'products.$.quantity': quantity,
        },
      },
    );

    const newQuantity = productInCart.quantity + quantity;
    return {
      type: 'inc',
      cart: {
        _id: cartId,
        product: productId,
        quantity: newQuantity,
      },
    };
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const updatedResponse = await Cart.updateOne(
      {
        _id: cartId,
        'products.product': productId,
      },
      {
        'products.$.quantity': quantity,
      },
    );

    if (updatedResponse.matchedCount === 0) {
      throw new ResourceNotFoundError(
        `Product with id ${productId} might not exist in cart ${cartId}`,
      );
    }

    return {
      _id: cartId,
      product: productId,
      quantity,
    };
  }

  async removeOneProduct(cartId, productId) {
    return Cart.removeOneProduct(cartId, productId);
  }

  async removeAllProducts(cartId) {
    return Cart.removeAllProducts(cartId);
  }
}
