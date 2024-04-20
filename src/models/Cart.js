import { randomUUID } from 'node:crypto';
import BaseModel from './BaseModel.js';
// const { default: ObjectFileMapper } = await import('./ObjectFileMapper.js');

/**
 * @typedef {import('./types').CartType} CartType
 * @typedef {import('./types').CartProduct} CartProduct
 * @typedef {import('./types').UUIDType} UUIDType
 */

export class Cart extends BaseModel {
  constructor(path) {
    super(path, 'Cart');
  }

  /**
   * Returns the list of shopping carts
   * @returns {Promise<CartType[]>} Promise that resolves to the list of shopping carts
   */
  async getCarts() {
    return this.fetchAll();
  }

  /**
   * Returns the list products of a shopping cart
   * @param {UUIDType} id UUID of product
   * @returns {Promise<CartProduct[]>} Promise that resolves to the list of products inside the shopping cart
   */
  async getCartById(id) {
    const { products } = await this.fetchOne(id);
    return products;
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
   * Adds new product to shopping cart or changes quantity of existing product
   * @param {UUIDType} cartId UUID of the cart
   * @param {CartProduct} newProduct New product to add with its quantity
   * @returns {Promise<CartProduct>} Promise that resolves to the added product
   */
  async addToCart(cartId, newProduct) {
    const allCarts = await this.fetchAll();

    /**
     * @type {{foundResource: Cart, resourceIdx: number}}
     */
    const found = this.findById(cartId);
    const { foundResource: foundCart, resourceIdx: cartIdx } = found;

    const productToUpdateIdx = foundCart.products.findIndex(
      ({ product: productId }) => productId === newProduct.product,
    );
    /**
     * @type {CartProduct}
     */
    const addedProduct = { product: newProduct.product, quantity: 1 };
    if (productToUpdateIdx === -1) {
      foundCart.products.push(newProduct);
    } else {
      // TODO: change this to allow increasing or decreasing in some arbitrary quantity
      // eslint-disable-next-line no-plusplus
      foundCart.products[productToUpdateIdx].quantity++;
      addedProduct.quantity = foundCart.products[productToUpdateIdx].quantity;
    }

    allCarts[cartIdx] = foundCart;
    await this.save(allCarts);
    return addedProduct;
  }
}
