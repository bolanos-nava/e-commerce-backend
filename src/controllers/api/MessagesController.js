import BaseController from './BaseController.js';
import { messageValidator } from '../../schemas/zod/message.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 * @typedef {import('../../types').ServicesType['messages']} MessagesServiceType
 */
export default class MessagesController extends BaseController {
  /** @type MessagesServiceType */
  #messagesService;

  constructor(messagesService) {
    super();
    this.#messagesService = messagesService;
  }

  /**
   * Creates a new message
   *
   * @type {ExpressType['RequestHandlerWS']}
   */
  async create(req, res, next) {
    try {
      const { message: request } = req.body;
      const validMessage = messageValidator.parse(request);
      const newMessage = await this.#messagesService.save(validMessage);

      req.socketServer.emit('new_message', newMessage);

      res.status(201).json({
        status: 'created',
        payload: { message: newMessage },
      });
    } catch (error) {
      next(error);
    }
  }
}
