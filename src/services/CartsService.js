/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['carts']} CartsDao
 * @typedef {import('../types').MongoIdType} MongoIdType
 * @typedef {import('../types').CartProduct} CartProduct
 */

export default class CartsService {
  /** @type CartsDao */
  #cartsDao;

  /**
   * Constructs a new carts service with injected carts DAO
   *
   * @param {CartsDao} cartsDao
   */
  constructor(cartsDao) {
    this.#cartsDao = cartsDao;
  }

  /**
   * Adds a product to a cart if it doesn't exist in the cart, or updates its quantity if it already exists. This makes this operation NOT idempotent.
   *
   * @param {MongoIdType} cartId - Id of cart
   * @param {MongoIdType} productId - Id of product to add
   * @param {number} quantity - Quantity of product to add
   * @returns Object with information about the added product
   */
  async addProductToCart(cartId, productId, quantity) {
    const addedQuantity = await this.#cartsDao.addProductToCart(
      cartId,
      productId,
      quantity,
    );
    return {
      _id: cartId,
      product: productId,
      quantity: addedQuantity,
    };
  }

  /**
   * Adds array of products to cart
   *
   * @param {MongoIdType} cartId - Id of cart
   * @param {CartProduct[]} products - Array of the products to add with their quantities
   * @returns Cart object with array of updated products
   */
  async addProductsToCart(cartId, products) {
    const updatedProducts = await this.#cartsDao.addProductsToCart(
      cartId,
      products,
    );
    return {
      _id: cartId,
      updatedProducts,
    };
  }

  /**
   * Returns a cart with its nested products
   *
   * @param {MongoIdType} cartId - Id of the cart
   * @param {{lean?: boolean}} options - Options object.
   * - lean: to return the cart as a POJO
   * @returns Cart
   */
  async get(cartId, { lean = false } = {}) {
    await this.#cartsDao.removeUndefinedProducts(cartId);
    const cart = await this.#cartsDao.get(cartId, { lean });
    return {
      _id: cartId,
      products: cart.products,
    };
  }

  /**
   * Removes all products from a cart
   *
   * @param {MongoIdType} cartId - Id of cart
   */
  async removeAllProducts(cartId) {
    await this.#cartsDao.removeAllProducts(cartId);
  }

  /**
   * Removes a product from a cart
   *
   * @param {MongoIdType} cartId - Id of cart
   * @param {MongoIdType} productId - Id of product to remove
   */
  async removeProduct(cartId, productId) {
    await this.#cartsDao.removeProduct(cartId, productId);
  }

  /**
   * Saves new cart
   * @returns Object containing the new cart
   */
  async save() {
    const cart = this.#cartsDao.save();
    return {
      _id: cart.id,
      products: [],
    };
  }

  /**
   * Idempotent operation to update the quantity of a product in a cart
   *
   * @param {MongoIdType} cartId - Id of cart
   * @param {MongoIdType} productId - Id of product whose quantity to change
   * @param {number} quantity - New quantity
   */
  async updateProductQuantity(cartId, productId, quantity) {
    await this.#cartsDao.updateProductQuantity(cartId, productId, quantity);
  }
}
