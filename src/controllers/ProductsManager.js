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
   * Method to validate fields of a product
   * @param {Product} _product
   * @returns {Product} Validated product
   */
  static validateProduct(_product) {
    return {
      ..._product,
      price: Number(_product.price),
      stock: Number(_product.stock),
    };
  }

  /**
   * Returns the list of products
   * @returns {Promise<Product[]>} Promise that resolves to the list of products
   */
  async getProducts() {
    return this.fetchAll();
  }

  /**
   * Returns the data of a product
   * @param {UUIDType} id UUID of the product to fetch
   * @returns {Promise<Product>} Promise that resolves to the fetched product
   */
  async getProductById(id) {
    return this.fetchOne(id);
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
      ...ProductsManager.validateProduct(_product),
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
    return this.deleteOne(id);
  }

  /**
   * Updates a product
   * @param {UUIDType} id UUID of the product
   * @param {Promise<Partial<Product>>} newData New data to update the product with
   * @returns {Promise<Product>} Promise that resolves to the updated product
   */
  async updateProduct(id, newData) {
    return this.updateOne(id, newData);
  }
}
