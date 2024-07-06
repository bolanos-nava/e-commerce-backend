import { Types } from 'mongoose';
import {
  ParameterError,
  ResourceNotFoundError,
  InvalidFieldValueError,
} from '../../customErrors/index.js';

/**
 * @typedef {import('../../types/index.js').ICart} ICart
 * @typedef {import('../../types/index.js').ICartModel} ICartModel
 * @typedef {import('../../types/index.js').CartProduct} CartProduct
 * @typedef {import('../../types/index.js').IProduct} IProduct
 * @typedef {import('../../types/index.js').IProductModel} IProductModel
 */

export class CartsMongoDao {
  /** @type ICartModel */
  #Cart;
  /** @type IProductModel */
  #Product;

  /**
   * Constructs new carts service
   *
   * @param {ICartModel} Cart - Cart model
   * @param {IProductModel} Product - Product model
   */
  constructor(Cart, Product) {
    this.#Cart = Cart;
    this.#Product = Product;
  }

  /**
   * Saves a cart to the database
   *
   * @returns Response after save
   */
  async save() {
    return new this.#Cart().save();
  }

  /**
   * Returns a cart with populated products
   *
   * @param {ICart['_id']} cartId
   * @returns
   */
  async get(cartId, { lean = false } = {}) {
    const cart = await this.#Cart.findById(cartId).populate({
      path: 'products',
      populate: {
        path: 'product',
      },
    });
    if (!cart) {
      throw new ResourceNotFoundError(`Cart with id ${cartId} not found`);
    }
    return lean ? cart.toObject() : cart;

    /**
     * The problem with the chaining of Mongoose methods is that you can't do something like
     * <code>
     *    const method = Cart.findByIdAndThrow(cartId)
     *    const a = method.lean()
     *    const b = await method.populate()
     * </code>
     * Because my custom method "Cart.findByIdAndThrow()" returns a Promise. On the contrary, the original "Cart.findById" returns a QueryHelper, which you can execute if you await the promise
     *
     * I think monads would be unnecessary here and wouldn't actually solve the problem... Which is that my custom method "findByIdAndThrow()" executes the query internally to check if the resource exists. If it doesn't, throws. If it does, returns the resource. The problem is that for that method to work, I would have to return the query, but then, how would I execute it if I'm returning the actual query object? I think there's no way
     */
  }

  /**
   * Adds a product to the cart in the case it doesn't exist. If it exists, increases its quantity
   *
   * @param {ICart['_id']} cartId
   * @param {IProduct['_id']} productId
   * @param {number} quantity
   * @returns Information about the added/updated product
   */
  async addProductToCart(cartId, productId, quantity) {
    /* This endpoint assumes the cart exists */

    /* We don't assume the product exists in the database, it could have been deleted */
    const product = await this.#Product.findByIdAndThrow(productId);
    const productInCart = await this.#Cart.findProductInCart(cartId, productId);

    if (!product.status) {
      throw new ResourceNotFoundError(`Product with ${productId} unavailable`);
    }

    if (!productInCart) {
      await this.#Cart.updateOne(
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

    const newQuantity = productInCart.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new InvalidFieldValueError(
        "Quantity can't be greater than the available stock",
      );
    }
    await this.#Cart.updateOne(
      { _id: cartId, 'products.product': productId },
      { $inc: { 'products.$.quantity': quantity } },
    );

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
   * @param {ICart['_id']} cartId
   * @param {CartProduct[]} products
   * @returns Result of updating the products in the cart
   */
  async addProductsToCart(cartId, products) {
    /* This endpoint assumes all products that we want to push exist in the database */
    // TODO: Check which products actually exist?

    const cart = await this.#Cart.findByIdAndThrow(cartId);

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
      await this.#Cart.updateOne(
        { _id: cartId },
        {
          $push: { products: { $each: productsToPush } },
        },
      );
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const { product, quantity } of productsToUpdate) {
      // eslint-disable-next-line no-await-in-loop
      await this.#Cart.updateOne(
        { _id: cartId, 'products.product': product },
        { $inc: { 'products.$.quantity': quantity } },
      );
    }

    const updatedCart = await this.#Cart.aggregate([
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
   * @param {ICart['_id']} cartId
   * @param {IProduct['_id']} productId
   * @param {number} quantity
   * @returns
   */
  async updateProductQuantity(cartId, productId, quantity) {
    /* Endpoint assumes the cart exists */

    const productInCart = await this.#Cart.findProductInCart(
      cartId,
      productId,
      {
        populate: true,
      },
    );
    if (!productInCart) {
      throw new ResourceNotFoundError("Product doesn't exist in cart");
    }
    const increasingQuantity = quantity > productInCart.quantity;
    if (increasingQuantity && quantity > productInCart.product.stock) {
      throw new ParameterError('Quantity is greater than the available stock');
    }

    await this.#Cart.updateOne(
      { _id: cartId, 'products.product': productId },
      { 'products.$.quantity': quantity },
    );

    return {
      _id: cartId,
      product: productId,
      quantity,
    };
  }

  /**
   * Removes a product from a cart
   *
   * @param {ICart['_id']} cartId
   * @param {IProduct['_id']} productId
   * @returns Response from removing a product from a cart
   */
  async removeProduct(cartId, productId) {
    return this.#Cart.removeOneProduct(cartId, productId);
  }

  /**
   * Removes all products from a cart
   *
   * @param {ICart['_id']} cartId
   * @returns Response of removing all products from a cart
   */
  async removeAllProducts(cartId) {
    return this.#Cart.removeAllProducts(cartId);
  }

  /**
   * Helper method to remove products from cart which no longer exist on the products collection
   *
   * @param {ICart['_id']} cartId
   * @returns Result of updating the cart
   */
  async removeUndefinedProducts(cartId) {
    const undefinedProductsAggregation = await this.#Cart.aggregate([
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
      return this.#Cart.updateOne(
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
