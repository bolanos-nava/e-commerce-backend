import { z } from 'zod';

/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['products']} ProductsDao
 * @typedef {import('../types').ProductsFilterType} ProductsFilterType
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
  delete(productId) {
    return this.#productsDao.delete(productId);
  }

  /**
   * Returns a product
   *
   * @param {MongoIdType} productId
   * @returns
   */
  get(productId) {
    return this.#productsDao.get(productId);
  }

  /**
   * Returns list of products. The underlying DAO method should support pagination and filtering
   *
   * @param {ProductsFilterType} filter - Filter object to query products
   * @param {ListOptions} options - Options to paginate products
   * @returns List of products
   */
  getAll(filter, { limit, page, sort, lean = false } = {}) {
    const defaultOptions = {
      limit: 10,
      page: 1,
      sort: 'ASC',
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
      .enum(['ASC', 'DESC'])
      .default('ASC')
      .optional()
      .catch('ASC')
      .parse(sort?.toUpperCase());
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
  save(product) {
    return this.#productsDao.save(product);
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
