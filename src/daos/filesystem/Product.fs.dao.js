import path from 'node:path';
import { randomUUID } from 'node:crypto';
import BaseModel from '../../models/BaseModel.js';
import { getCodeValidator } from '../../schemas/zod/index.js';

/**
 * @typedef {import('../types').ProductType} ProductType
 * @typedef {import('../types').UUIDType} UUIDType
 */

export class Product extends BaseModel {
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
    const codeValidator = getCodeValidator(product, products);
    const newProduct = {
      id: randomUUID(),
      ...codeValidator.passthrough().parse(product),
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
    const codeValidator = getCodeValidator({ id, ..._newData }, products);

    const newData = Object.hasOwn(_newData, 'code')
      ? codeValidator.passthrough().parse(_newData)
      : _newData;

    return this.updateOne(id, newData);
  }
}
