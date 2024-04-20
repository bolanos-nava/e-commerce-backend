import path from 'node:path';
import { randomUUID } from 'node:crypto';
import BaseModel from './BaseModel.js';
// const { default: ObjectFileMapper } = await import('./ObjectFileMapper.js');

/**
 * @typedef {import('./types').CartType} CartType
 * @typedef {import('./types').CartProduct} CartProduct
 * @typedef {import('./types').UUIDType} UUIDType
 */

export class Cart extends BaseModel {
  constructor() {
    super(`${path.resolve()}/carts.json`, 'Cart');
  }

  /**
   * Returns the list of shopping carts
   * @returns {Promise<CartType[]>} Promise that resolves to the list of shopping carts
   */
  async getCarts() {
    return this.fetchAll();
  }

  /**
   * Returns the data of a shopping cart
   * @param {UUIDType} id UUID of product
   * @returns {Promise<CartType>} Promise that resolves to the shopping cart
   */
  async getCartById(id) {
    return this.fetchOne(id);
  }

  /**
   * Creates new shopping cart
   * @returns {Promise<CartType>} Promise that resolves to the new shopping cart
   */
  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: randomUUID(),
      products: [],
    };

    carts.push(newCart);
    await this.save(carts);
    return newCart;
  }

  /**
   * Updates a cart
   * @param {UUIDType} cartId UUID of the cart
   * @param {CartType} newData New data of the cart
   * @returns {Promise<CartType>} Promise that resolves to the updated cart
   */
  async updateCart(cartId, newData) {
    return this.updateOne(cartId, newData);
  }
}
