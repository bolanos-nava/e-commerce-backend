/**
 * @typedef {import('mongoose').FilterQuery<IProduct>} FilterQueryProduct
 * @typedef {import('../../types').ProductType} ProductType
 * @typedef {import('../../types').IProduct} IProduct
 * @typedef {import('../../types').IProductPopulated} IProductPopulated
 * @typedef {import('../../types').IProductModel} IProductModel
 * @typedef {import('../../customErrors')} ResourceNotFoundError
 * @typedef {import('../../types').ProductsFilterType} ProductsFilterType
 * @typedef {import('../../types').ListOptions} ListOptions
 * @typedef {import('../../types').PaginateOptions} PaginateOptions
 */

import { z } from 'zod';
import { logger } from '../../configs/index.js';
import { ResourceNotFoundError } from '../../customErrors/index.js';

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
   * @returns {Promise<IProductPopulated>} Product from database
   */
  async get(productId, { lean = false, populated = false } = {}) {
    const productQuery = this.#Product.findById(productId);
    if (populated) {
      productQuery.populate({
        path: 'createdBy',
      });
    }

    const product = await productQuery;
    if (!product) {
      throw new ResourceNotFoundError(`Product not found with id ${productId}`);
    }
    return lean ? product.toObject() : product;
  }

  /**
   * Return list of products
   *
   * @param {FilterQueryProduct} filters Filter object
   * @param {ListOptions} options Amount of products to return
   * @returns Products from database
   */
  async getAll(filters = {}, options = {}) {
    logger.debug('Paginate options', { options });
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

    if (newProduct.stock <= 0) {
      newProduct.status = false;
    }

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
      status: z.boolean().optional().parse(filter.status),
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
    if (typeof filter.status !== 'undefined')
      filterObject.status = filter.status;

    return filterObject;
  }
}
