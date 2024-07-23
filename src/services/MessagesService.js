/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['messages']} MessagesDao
 * @typedef {import('../types').MessageType} MessageType
 */

export default class MessagesService {
  /** @type MessagesDao */
  #messagesDao;

  /**
   * Constructs a new messages service with injected messages DAO
   *
   * @param {MessagesDao} messagesDao
   */
  constructor(messagesDao) {
    this.#messagesDao = messagesDao;
  }

  /**
   * Returns list of messages
   *
   * @returns Object containing list of messages
   */
  async getAll({ lean = false } = {}) {
    const messages = await this.#messagesDao.getAll({ lean });
    return messages;
  }

  /**
   * Saves new message to database
   *
   * @param {MessageType} message - Message to add
   * @returns
   */
  async save(message) {
    return this.#messagesDao.save(message);
  }
}
