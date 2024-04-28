import path from 'node:path';
import { randomUUID } from 'node:crypto';
import BaseModel from './BaseModel.js';
import { validateDuplicatedCode } from '../schemas/zod/index.js';

/**
 * @typedef {import('../types').ProductType} ProductType
 * @typedef {import('../types').UUIDType} UUIDType
 */

export class Product extends BaseModel {
  /**
   * Shape of product object
   * @type {ProductType}
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

  constructor() {
    super(`${path.resolve()}/products.json`, 'Product');
  }

  /**
   * Returns the list of products
   * @returns {Promise<ProductType[]>} Promise that resolves to the list of products
   */
  async getProducts() {
    return this.fetchAll();
  }

  /**
   * Returns the data of a product
   * @param {UUIDType} id UUID of the product to fetch
   * @returns {Promise<ProductType>} Promise that resolves to the fetched product
   */
  async getProductById(id) {
    return this.fetchOne(id);
  }

  /**
   * Creates a new product
   * @param {ProductType} product Data of the product to create
   * @returns {Promise<ProductType>} Promise that resolves to the new product
   */
  async createProduct(product) {
    const products = await this.getProducts();

    const newProduct = {
      id: randomUUID(),
      ...validateDuplicatedCode(product, products),
    };

    products.push(newProduct);
    await this.save(products);
    return newProduct;
  }

  /**
   * Deletes a product
   * @param {UUIDType} id UUID of the product to delete
   * @returns {Promise<ProductType>} Promise that resolves to the deleted product
   */
  async deleteProduct(id) {
    return this.deleteOne(id);
  }

  /**
   * Updates a product
   * @param {UUIDType} id UUID of the product
   * @param {Partial<ProductType>} _newData New data to update the product with
   * @returns {Promise<ProductType>} Promise that resolves to the updated product
   */
  async updateProduct(id, _newData) {
    const products = await this.getProducts();

    const newData = {
      ..._newData,
      ...(_newData.code
        ? validateDuplicatedCode({ id, ..._newData }, products)
        : {}),
    };

    return this.updateOne(id, newData);
  }
}
