'use strict';
import { randomUUID } from 'node:crypto';
import ObjectFileMapper from './ObjectFileMapper.js';
import {
  AttributeError,
  DuplicateResourceError,
} from '../customErrors/index.js';

/**
 * @typedef {import('./types.d.ts').Product} Product
 * @typedef {import('./types.d.ts').UUIDType} UUIDType
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
    thumbnails: [],
  };

  constructor(path) {
    super(path, 'Product');
  }

  /**
   * Returns the list of products
   * @returns {Promise<Product[]>} Promise that resolves to the list of products
   */
  async getProducts() {
    return await this.fetchAll();
  }

  /**
   * Returns the data of a product
   * @param {UUIDType} id UUID of the product to fetch
   * @returns {Promise<Product>} Promise that resolves to the fetched product
   */
  async getProductById(id) {
    return await this.fetchOne(id);
  }

  /**
   * Creates a new product
   * @param {Product} _product Data of the product to create
   * @returns {Promise<Product>} Promise that resolves to the new product
   */
  async createProduct(_product) {
    const products = await this.getProducts();

    const newProduct = {
      ...this.#baseProduct,
      ..._product,
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
    await this.save(products);
    return newProduct;
  }

  /**
   * Deletes a product
   * @param {UUIDType} id UUID of the product to delete
   * @returns {Promise<Product>} Promise that resolves to the deleted product
   */
  async deleteProduct(id) {
    return await this.deleteOne(id);
  }

  /**
   * Updates a product
   * @param {UUIDType} id UUID of the product
   * @param {Promise<Partial<Product>>} newData New data to update the product with
   * @returns {Promise<Product>} Promise that resolves to the updated product
   */
  async updateProduct(id, newData) {
    return await this.updateOne(id, newData);
  }
}
