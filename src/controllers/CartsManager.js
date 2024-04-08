import { randomUUID } from 'node:crypto';
import ObjectFileMapper from './ObjectFileMapper.js';

/**
 * @typedef {import('./types.d.ts').Cart} Cart
 * @typedef {import('./types.d.ts').CartProduct} CartProduct
 * @typedef {import('./types.d.ts').UUIDType} UUIDType
 */

export class CartsManager extends ObjectFileMapper {
  constructor(path) {
    super(path, 'Cart');
  }

  async getCarts() {
    return await this.fetchAll();
  }

  async getCartById(id) {
    const { products } = await this.fetchOne(id);
    return products;
  }

  /**
   *
   * @param {CartProduct[]} cartProducts Products to add to the newly created cart
   */
  async createCart(cartProducts) {
    const carts = await this.getCarts();
    console.log(carts);

    const newCart = {
      id: randomUUID(),
      products: cartProducts,
    };

    carts.push(newCart);
    return await this.save(carts);
  }

  /**
   *
   * @param {UUIDType} cartId
   * @param {CartProduct} newProduct
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
    console.log(productToUpdateIdx);
    if (productToUpdateIdx === -1) {
      foundCart.products.push(newProduct);
    } else {
      // TODO: change this to allow for increasing and decreasing in some arbitrary quantity
      foundCart.products[productToUpdateIdx].quantity++;
    }

    allCarts[cartIdx] = foundCart;
    return await this.save(allCarts);
  }
}
