/**
 * @typedef {import('../../types').MessageType} MessageType
 * @typedef {import('../../types').IMessageModel} IMessageModel
 */

export class MessagesMongoDao {
  /** @type IMessageModel */
  #Message;

  /**
   * Constructs new messages Mongoose DAO
   *
   * @param {IMessageModel} Message - Message model
   */
  constructor(Message) {
    this.#Message = Message;
  }

  /**
   * Returns the list of messages
   *
   * @returns List of messages
   */
  async getAll({ lean = false } = {}) {
    return this.#Message.find({}, {}, { lean });
  }

  /**
   * Saves a message to the database
   *
   * @param {MessageType} body - Body object
   * @returns Response after saving message
   */
  async save(body) {
    return new this.#Message(body).save();
  }
}
