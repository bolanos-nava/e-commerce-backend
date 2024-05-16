/* eslint-disable class-methods-use-this */
import { Types } from 'mongoose';
import { Cart, Product } from '../daos/models/index.js';
import { ResourceNotFoundError } from '../customErrors/ResourceNotFoundError.js';

/**
 * @typedef {import('../types').MongoIdType} MongoIdType
 */

export default class CartsService {
  /**
   * Saves a cart to the database
   *
   * @returns Response after save
   */
  async createNewCart() {
    const cart = new Cart();
    return cart.save();
  }

  /**
   * Returns a cart with populated products
   *
   * @param {MongoIdType} cartId
   * @returns
   */
  async getCart(cartId, { lean = false } = {}) {
    await this.#removeUndefinedProducts(cartId);

    // TODO: try to solve the chaining of Mongoose methods with monads
    const cart = await Cart.findByIdAndThrow(cartId);
    const cartPopulated = await cart.populate({
      path: 'products',
      populate: {
        path: 'product',
      },
    });

    // let cartPopulated;
    // const populateQuery = {
    //   path: 'products',
    //   populate: {
    //     path: 'product',
    //   },
    // };
    // if (lean) {
    //   cartPopulated = await Cart.findById(cartId)
    //     .lean()
    //     .populate(populateQuery);
    // } else {
    //   cartPopulated = await Cart.findById(cartId).populate(populateQuery);
    // }

    // if (!cartPopulated)
    //   throw new ResourceNotFoundError(`Cart with id ${cartId} not found`);

    // cartPopulated.products = cartPopulated.products.map((p) => p.toObject());

    return lean
      ? {
          ...cartPopulated,
          products: cartPopulated.products.map((p) => p.toObject()),
        }
      : cartPopulated;
  }

  /**
   * Adds a product to the cart in the case it doesn't exist. If it exists, increases its quantity
   *
   * @param {MongoIdType} cartId
   * @param {MongoIdType} productId
   * @param {number} quantity
   * @returns Information about the added/updated product
   */
  async addOneProductToCart(cartId, productId, quantity) {
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

  /**
   * Adds an array of products to the cart.
   * From the input array, this method adds to the cart
   * the products which don't exist yet and increases the
   * quantity of the ones that already exist.
   *
   * Note: the quantity change is always incremental.
   *
   * @param {MongoIdType} cartId
   * @param {{product: MongoIdType, quantity: number}[]} products
   * @returns Result of updating the products in the cart
   */
  async addProductsToCart(cartId, products) {
    const cart = await Cart.findByIdAndThrow(cartId);

    const { products: productsInCart } = cart;
    const productsInCartIds = productsInCart.map(({ product }) =>
      product.toString(),
    );

    const productsToPush = [];
    const productsToUpdate = [];
    products.forEach((product) => {
      const isProductInCart = productsInCartIds.includes(product.product);
      if (isProductInCart) productsToUpdate.push(product);
      else productsToPush.push(product);
    });

    if (productsToPush.length) {
      await Cart.updateOne(
        { _id: cartId },
        {
          $push: { products: { $each: productsToPush } },
        },
      );
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const { product, quantity } of productsToUpdate) {
      // eslint-disable-next-line no-await-in-loop
      await Cart.updateOne(
        { _id: cartId, 'products.product': product },
        { $inc: { 'products.$.quantity': quantity } },
      );
    }

    const updatedCart = await Cart.aggregate([
      { $match: { _id: new Types.ObjectId(cartId) } },
      {
        $addFields: {
          products: {
            $filter: {
              input: '$products',
              as: 'product',
              cond: {
                $in: [
                  '$$product.product',
                  products.map(({ product }) => new Types.ObjectId(product)),
                ],
              },
            },
          },
        },
      },
    ]);

    return updatedCart[0];
  }

  /**
   * Idempotent function to change the quantity of a product
   * in a cart. It is idempotent because it updates
   * the quantity absolutely, not incrementally.
   *
   * @param {MongoIdType} cartId
   * @param {MongoIdType} productId
   * @param {number} quantity
   * @returns
   */
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

  /**
   * Removes a product from a cart
   *
   * @param {MongoIdType} cartId
   * @param {MongoIdType} productId
   * @returns Response from removing a product from a cart
   */
  async removeOneProduct(cartId, productId) {
    return Cart.removeOneProduct(cartId, productId);
  }

  /**
   * Removes all products from a cart
   *
   * @param {MongoIdType} cartId
   * @returns Response of removing all products from a cart
   */
  async removeAllProducts(cartId) {
    return Cart.removeAllProducts(cartId);
  }

  /**
   * Helper method to remove products from cart which no longer exist on the products collection
   *
   * @param {MongoIdType} cartId
   * @returns Result of updating the cart
   */
  async #removeUndefinedProducts(cartId) {
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
}
