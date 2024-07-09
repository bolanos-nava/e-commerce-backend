import { randomUUID } from 'node:crypto';

/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['tickets']} TicketsDao
 * @typedef {import('../types').MongoIdType} MongoIdType
 * @typedef {import('../types').CartProduct} CartProduct
 */

export default class TicketsService {
  /** @type TicketsDao */
  #ticketsDao;

  /**
   * Constructs a new tickets service with injected DAO of tickets
   *
   * @param {TicketsDao} ticketsDao
   */
  constructor(ticketsDao) {
    this.#ticketsDao = ticketsDao;
  }

  /**
   *
   * @param {string} purchaser - Email of purchaser
   * @param {{
   *    _id: MongoIdType;
   *    filteredProducts: {available: CartProduct[]; unavailable: CartProduct[];};
   * }} cart - Cart with filtered products
   * @returns
   */
  async save(purchaser, cart) {
    const code = randomUUID();
    const amount = cart.filteredProducts.available.reduce(
      (sum, { quantity }) => sum + quantity,
      0,
    );
    return this.#ticketsDao.save({ purchaser, code, amount }, cart);
  }
}
