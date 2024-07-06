export default class CartsService {
  #cartsDao;

  constructor(cartsDao) {
    this.#cartsDao = cartsDao;
  }

  async save() {
    return this.#cartsDao.save();
  }

  async get(cartId, { lean = false } = {}) {
    await this.#cartsDao.removeUndefinedProducts(cartId);
    return this.#cartsDao.get(cartId, { lean });
  }

  async addProductToCart(cartId, productId, quantity) {
    return this.#cartsDao.addProductToCart(cartId, productId, quantity);
  }

  async addProductsToCart(cartId, products) {
    return this.#cartsDao.addProductsToCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return this.#cartsDao.updateProductQuantity(cartId, productId, quantity);
  }

  async removeProduct(cartId, productId) {
    return this.#cartsDao.removeProduct(cartId, productId);
  }

  async removeAllProducts(cartId) {
    return this.#cartsDao.removeAllProducts(cartId);
  }
}
