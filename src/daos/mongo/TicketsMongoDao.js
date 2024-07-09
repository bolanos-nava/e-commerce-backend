/**
 * @typedef {import('../../types').ITicketModel} ITicketModel
 * @typedef {import('../../types').ICartModel} ICartModel
 */

export class TicketsMongoDao {
  /** @type ITicketModel */
  #Ticket;
  /** @type ICartModel */
  #Cart;

  /**
   * Constructs new tickets DAO for Mongo
   *
   * @param {ITicketModel} Ticket - Ticket model
   * @param {ICartModel} Cart - Cart model
   */
  constructor(Ticket, Cart) {
    this.#Ticket = Ticket;
    this.#Cart = Cart;
  }

  /**
   * Saves a ticket to the database and updates cart
   *
   * @returns Response after save
   */
  async save(ticket, cart) {
    const newTicket = new this.#Ticket({
      ...ticket,
      products: cart.filteredProducts.available,
    });

    // TODO: wrap the update of the cart and the creation of the new ticket in a transaction
    const updated = await this.#Cart.findOneAndUpdate(
      { _id: cart._id },
      { products: cart.filteredProducts.unavailable },
      { new: true },
    );
    return newTicket.save();
  }
}
