import { z } from 'zod';

/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['products']} ProductsDao
 * @typedef {import('../types').ProductsFilterType} ProductsFilterType
 * @typedef {import('../types').IProductPopulated} IProductPopulated
 * @typedef {import('../types').ListOptions} ListOptions
 * @typedef {import('../types').ProductType} ProductType
 * @typedef {import('../types').MongoIdType} MongoIdType
 */

// TODO: add method to increase or decrease stock
// TODO: refactor to be equal to CartsService

export default class ProductsService {
  /** @type ProductsDao */
  #productsDao;

  /**
   * Constructs a new products service with injected DAO of products
   *
   * @param {ProductsDao} productsDao
   */
  constructor(productsDao) {
    this.#productsDao = productsDao;
  }

  /**
   * Deletes a product
   *
   * @param {MongoIdType} productId
   * @returns
   */
  async delete(productId) {
    return this.#productsDao.delete(productId);
  }

  /**
   * Returns a product
   *
   * @param {MongoIdType} productId
   * @returns Product
   */
  async get(productId, { populated = false, lean = false } = {}) {
    const product = await this.#productsDao.get(productId, { populated, lean });
    return { product };
  }

  /**
   * Returns list of products. The underlying DAO method should support pagination and filtering
   *
   * @param {ProductsFilterType} filter - Filter object to query products
   * @param {ListOptions} options - Options to paginate products
   * @returns List of products
   */
  getAll(filter, { limit, page, sort, lean = false } = {}) {
    // eslint-disable-next-line no-param-reassign
    if (sort) sort = sort?.split(',').join(' ');

    /** @type ListOptions */
    const defaultOptions = {
      limit: 10,
      page: 1,
      sort: '-createdAt',
      lean: false,
    };

    const validLimit = z.coerce
      .number()
      .int()
      .positive()
      .default(10)
      .optional()
      .catch(10)
      .parse(limit);
    if (validLimit) defaultOptions.limit = validLimit;
    const validPage = z.coerce
      .number()
      .int()
      .positive()
      .default(1)
      .optional()
      .catch(1)
      .parse(page);
    if (validPage) defaultOptions.page = validPage;
    const validSort = z
      .string()
      .default('-createdAt')
      .optional()
      .catch('-createdAt')
      .parse(sort);
    if (validSort) defaultOptions.sort = validSort;
    const validLean = z
      .boolean()
      .default(false)
      .optional()
      .catch(false)
      .parse(lean);
    if (validLean === true || validLean === false) {
      defaultOptions.lean = validLean;
    }

    return this.#productsDao.getAll(filter, defaultOptions);
  }

  /**
   * Saves new product
   *
   * @param {ProductType} product - New product
   * @returns New product
   */
  async save(product) {
    const newProduct = await this.#productsDao.save(product);
    return { product: newProduct };
  }

  /**
   * Updates a product
   *
   * @param {MongoIdType} productId
   * @param {Partial<ProductType>} newData
   * @returns Updated product
   */
  update(productId, newData) {
    return this.#productsDao.update(productId, newData);
  }
}
