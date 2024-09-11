/**
 * @typedef {import('mongoose').FilterQuery<IProduct>} FilterQueryProduct
 * @typedef {import('../../types').ProductType} ProductType
 * @typedef {import('../../types').IProduct} IProduct
 * @typedef {import('../../types').IProductModel} IProductModel
 * @typedef {import('../../customErrors')} ResourceNotFoundError
 * @typedef {import('../../types').ProductsFilterType} ProductsFilterType
 * @typedef {import('../../types').ListOptions} ListOptions
 */

import { z } from 'zod';

export class ProductsMongoDao {
  /** @type IProductModel */
  #Product;

  /**
   * Constructs a new products service
   *
   * @param {IProductModel} Product - Product model
   */
  constructor(Product) {
    this.#Product = Product;
  }

  /**
   * Deletes product from the database
   *
   * @param {IProduct['_id']} productId
   * @returns Response after deleting
   */
  async delete(productId) {
    const product = await this.#Product.findByIdAndThrow(productId);
    return product.deleteOne();
  }

  /**
   * Returns data of a product
   *
   * @param {IProduct['_id']} productId
   * @throws ResourceNotFoundError
   * @returns Product from database
   */
  async get(productId) {
    return this.#Product.findByIdAndThrow(productId);
  }

  /**
   * Return list of products
   *
   * @param {FilterQueryProduct} filters Filter object
   * @param {ListOptions} options Amount of products to return
   * @returns Products from database
   */
  async getAll(filters = {}, options = {}) {
    const SORT_OPTIONS = {
      ASC: { price: 1 },
      DESC: { price: -1 },
    };

    if (options.sort) {
      // eslint-disable-next-line no-param-reassign
      options.sort = SORT_OPTIONS[options.sort.toUpperCase()];
    }

    const paginationResponse = await this.#Product.paginate(
      this.#computeFilters(filters),
      { lean: false, ...options },
    );

    const { docs: products } = paginationResponse;
    delete paginationResponse.docs;

    return {
      products,
      pagination: paginationResponse,
    };
  }

  /**
   * Saves a product to the database
   *
   * @param {ProductType} request Data of the product to add
   * @returns Response after save
   */
  async save(request) {
    const product = new this.#Product(request);
    return product.save();
  }

  /**
   * Updates a product from the database
   *
   * @param {IProduct['_id']} productId
   * @param {Partial<ProductType>} newData
   * @returns Response after saving
   */
  async update(productId, newData) {
    const product = await this.#Product.findByIdAndThrow(productId);
    const newProduct = Object.assign(product, newData);
    return newProduct.save();
  }

  /**
   * Computes filters for Mongoose pagination
   *
   * @param {ProductsFilterType} filter
   * @returns {{categoryId?: string; price?: {$gte?: number; $lte?: number}; stock: {$gte: number};}} Filters for Mongoose
   */
  #computeFilters(filter) {
    // eslint-disable-next-line no-param-reassign
    filter = {
      minPrice: z
        .number()
        .nonnegative()
        .optional()
        .default(0)
        .parse(filter.minPrice),
      maxPrice: z.number().nonnegative().optional().parse(filter.maxPrice),
      categoryId: z.string().optional().parse(filter.categoryId),
      minStock: z
        .number()
        .nonnegative()
        .optional()
        .default(0)
        .parse(filter.minStock),
    };

    const filterObject = {};
    if (filter.categoryId) filterObject.categoryId = filter.categoryId;
    if (filter.minPrice || filter.maxPrice) {
      filterObject.price = {
        ...(filter.minPrice ? { $gte: filter.minPrice } : {}),
        ...(filter.maxPrice ? { $lte: filter.maxPrice } : {}),
      };
    }
    if (filter.minStock) filterObject.stock = { $gte: filter.minStock };

    return filterObject;
  }
}
