import path from 'node:path';
import { randomUUID } from 'node:crypto';
import BaseModel from './BaseModel.js';
import { AttributeError } from '../customErrors/index.js';

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
   * Method to validate fields of a product
   * @param {ProductType} _product
   * @returns {ProductType} Validated product
   */
  static validateProduct(_product, products) {
    const product = {
      ..._product,
      price: Number(_product.price),
      stock: Number(_product.stock),
    };
    const errorMessages = [];

    const codeAlreadyExists = products.some((p) => p.code === product.code);
    if (codeAlreadyExists) {
      errorMessages.push(`Product with code ${product.code} already exists`);
    }

    ['price', 'stock'].forEach((property) => {
      const validations = [
        {
          check: Number.isNaN(product[property]),
          message: `${property} should be a number`,
        },
        {
          check: product[property] === 0,
          message: `${property} shouldn't be 0`,
        },
      ];

      validations.forEach(({ check, message }) => {
        if (check) errorMessages.push(message);
      });
    });

    ['title', 'description', 'category', 'code'].forEach((property) => {
      if (!product[property]) {
        errorMessages.push(`${property} shouldn't be empty`);
      }
    });

    if (errorMessages.length) {
      throw new AttributeError(JSON.stringify(errorMessages));
    }

    return product;
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
   * @param {ProductType} _product Data of the product to create
   * @returns {Promise<ProductType>} Promise that resolves to the new product
   */
  async createProduct(_product) {
    const products = await this.getProducts();

    const newProduct = {
      ...this.#baseProduct,
      ...Product.validateProduct(_product, products),
      id: randomUUID(),
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
   * @param {Partial<ProductType>} newData New data to update the product with
   * @returns {Promise<ProductType>} Promise that resolves to the updated product
   */
  async updateProduct(id, newData) {
    return this.updateOne(id, newData);
  }
}
