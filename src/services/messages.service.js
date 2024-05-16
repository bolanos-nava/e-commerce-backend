/* eslint-disable class-methods-use-this */
import { Message } from '../daos/models/index.js';

/**
 * @typedef {import('../types').MessageType} MessageType
 */

export default class MessagesService {
  /**
   * Saves a new message to the database
   *
   * @param {MessageType} body
   * @returns Response after saving message
   */
  async createNewMessage(body) {
    const message = new Message(body);
    return message.save();
  }

  /**
   * Returns the list of messages
   *
   * @returns List of messages
   */
  async getMessages() {
    return Message.find();
  }
}
