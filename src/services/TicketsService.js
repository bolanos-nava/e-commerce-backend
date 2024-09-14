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
   * Saves a new ticket
   *
   * @param {{purchaser: string; amount: number;}} ticket - Object containing purchaser's email and total purchase amount
   * @param {{
   *    _id: MongoIdType;
   *    amount: number;
   *    filteredProducts: {
   *      available: (
   *          CartProduct & {
   *            price: number;
   *            totalPrice: number;
   *          }
   *      )[];
   *      unavailable: CartProduct[];};
   * }} cart - Cart with filtered products and total purchase amount
   * @returns
   */
  async save({ purchaser, amount }, cart) {
    const code = randomUUID();
    const ticket = await this.#ticketsDao.save(
      { purchaser, code, amount },
      cart,
    );
    return { ticket };
  }
}
