'use strict';

import ObjectFileMapper from './ObjectFileMapper.js';
import {
  AttributeError,
  DuplicateResourceError,
} from '../customErrors/index.js';

export class ProductManager extends ObjectFileMapper {
  /**
   * Shape of product object
   * @type {Product}
   */
  #baseProduct = {
    id: null,
    title: null,
    description: null,
    price: null,
    thumbnail: null,
    code: null,
    stock: null,
  };

  constructor() {
    super('./products.json', 'Product');
  }

  /**
   * Adds a new product
   * @param {Product} _product
   * @returns If the product was saved
   */
  async addProduct(_product) {
    const products = await this.getProducts();

    const newId = products.length ? products[products.length - 1].id + 1 : 0;
    const newProduct = {
      ...this.#baseProduct,
      ..._product,
      id: newId,
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
