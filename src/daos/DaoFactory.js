/**
 * @typedef {import('../types').MongoDaosType} MongoDaosType
 */

export default class DaoFactory {
  #persistence;

  constructor(persistence) {
    this.#persistence = persistence;
  }

  /**
   * Dynamically returns DAOs based on selected persistence
   *
   * @returns {Promise<MongoDaosType>} Object containing the DAOs according to the persistence
   */
  async getDaos() {
    switch (this.#persistence) {
      case 'MONGO':
      default: {
        const {
          Cart,
          CartsMongoDao,
          Message,
          MessagesMongoDao,
          Product,
          ProductsMongoDao,
          Ticket,
          TicketsMongoDao,
          User,
          UsersMongoDao,
        } = await import('./mongo/index.js');
        return {
          carts: new CartsMongoDao(Cart, Product),
          messages: new MessagesMongoDao(Message),
          products: new ProductsMongoDao(Product),
          tickets: new TicketsMongoDao(Ticket, Cart),
          users: new UsersMongoDao(User, Cart),
        };
      }
    }
  }
}
