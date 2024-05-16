/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { Product } from '../daos/models/index.js';

/**
 * @typedef {import('../types/modelTypes.d.ts').ProductType} ProductType
 * @typedef {import('../types').MongoIdType} MongoIdType
 * @typedef {import('../customErrors/ResourceNotFoundError')} ResourceNotFoundError
 */

export default class ProductsService {
  /**
   * Return list of products
   *
   * @param {number} limit Amount of products to return
   * @returns Products from database
   */
  async getProducts(filter = {}, opts = {}) {
    const SORT_OPTIONS = {
      ASC: { price: 1 },
      DESC: { price: -1 },
    };

    if (opts.sort) opts.sort = SORT_OPTIONS[opts.sort.toUpperCase()];

    Object.entries(opts).forEach(([optionName, optionValue]) => {
      if (typeof optionValue === 'undefined') delete opts[optionName];
    });

    const options = {
      limit: 10,
      page: 1,
      lean: false,
      ...opts,
    };

    const paginationResponse = await Product.paginate(filter, options);

    const products = paginationResponse.docs;
    delete paginationResponse.docs;

    return {
      status: 'success',
      payload: {
        products,
        pagination: paginationResponse,
      },
    };
  }

  /**
   * Saves a product to the database
   *
   * @param {ProductType} request Data of the product to add
   * @returns Response after save
   */
  async saveProduct(request) {
    const product = new Product(request);
    return product.save();
  }

  /**
   * Returns data of a product
   *
   * @param {MongoIdType} productId
   * @throws ResourceNotFoundError
   * @returns Product from database
   */
  async getProductById(productId) {
    return Product.findByIdAndThrow(productId);
  }

  /**
   * Updates a product from the database
   *
   * @param {MongoIdType} productId
   * @param {Partial<ProductType>} request
   * @returns Response after saving
   */
  async updateProductById(productId, request) {
    const product = await Product.findByIdAndThrow(productId);
    const newProduct = Object.assign(product, request);
    return newProduct.save();
  }

  /**
   * Deletes product from the database
   *
   * @param {MongoIdType} productId
   * @returns Response after deleting
   */
  async deleteProductById(productId) {
    const product = await Product.findByIdAndThrow(productId);
    return product.deleteOne();
  }
}
