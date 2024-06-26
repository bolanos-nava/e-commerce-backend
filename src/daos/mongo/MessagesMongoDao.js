/**
 * @typedef {import('../../types').MessageType} MessageType
 * @typedef {import('../../types').IMessageModel} IMessageModel
 */

export class MessagesMongoDao {
  /** @type IMessageModel */
  #Message;

  /**
   * Constructs a new messages service
   *
   * @param {IMessageModel} Message - Message model
   */
  constructor(Message) {
    this.#Message = Message;
  }

  /**
   * Saves a new message to the database
   *
   * @param {MessageType} body - Body object
   * @returns Response after saving message
   */
  async createNewMessage(body) {
    const message = new this.#Message(body);
    return message.save();
  }

  /**
   * Returns the list of messages
   *
   * @returns List of messages
   */
  async getMessages() {
    return this.#Message.find();
  }
}
