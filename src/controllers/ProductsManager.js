'use strict';
import { randomUUID } from 'node:crypto';
import ObjectFileMapper from './ObjectFileMapper.js';
import {
  AttributeError,
  DuplicateResourceError,
} from '../customErrors/index.js';

/**
 * @typedef {import('./types.d.ts').Product} Product
 */

export class ProductsManager extends ObjectFileMapper {
  /**
   * Shape of product object
   * @type {Product}
   */
  #baseProduct = {
    id: null,
    title: null,
    description: null,
    category: null,
    price: null,
    stock: null,
    code: null,
    status: true,
    // thumbnails: null,
  };

  constructor(path) {
    super(path, 'Product');
  }

  /**
   * Returns the list of products
   * @returns {Promise<Product[]>} List of products
   */
  async getProducts() {
    return await this.fetchAll();
  }

  /**
   * Returns the data of a product
   * @param {number} id Id of the product to fetch
   * @returns {Promise<Product>}
   */
  async getProductById(id) {
    return await this.fetchOne(id);
  }

  /**
   * Adds a new product
   * @param {Product} _product
   * @returns If the product was saved
   */
  async createProduct(_product) {
    const products = await this.getProducts();

    const newProduct = {
      ...this.#baseProduct,
      ..._product,
      code: _product.code + randomUUID(),
      code: _product.code,
      id: randomUUID(),
    };

    if (
      Object.values(newProduct).some(
        (prop) => prop === null || typeof prop === 'undefined',
      )
    ) {
      throw new AttributeError('Missing attributes');
    }

    const codeAlreadyExists = products.some(
      (product) => product.code === newProduct.code,
    );
    if (codeAlreadyExists) {
      throw new DuplicateResourceError(
        `Producto con código ${newProduct.code} ya existe.`,
      );
    }

    products.push(newProduct);
    return await this.save(products);
  }

  /**
   * Deletes a product
   * @param {number} id Id of the product to delete
   * @returns {Promise<Product>} The deleted product
   */
  async deleteProduct(id) {
    return await this.deleteOne(id);
  }

  /**
   * Updates a product
   * @param {number} id
   * @param {Promise<Partial<Product>>} newData
   * @returns {Promise<Product>} The updated product
   */
  async updateProduct(id, newData) {
    return await this.updateOne(id, newData);
  }
}
