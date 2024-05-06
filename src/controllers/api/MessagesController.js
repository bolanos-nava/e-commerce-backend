/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import { Message } from '../../daos/models/index.js';
import { messageValidator } from '../../schemas/zod/message.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */
export default class MessagesController extends BaseController {
  /** @type {ControllerRoute[]} */
  routes = [
    {
      path: '/',
      httpMethod: 'POST',
      actions: this.create.bind(this),
    },
  ];

  /**
   * Creates a new message
   * @type {ExpressType['RequestHandlerWS']}
   */
  async create(req, res, next) {
    try {
      const { message: request } = req.body;
      const validMessage = messageValidator.parse(request);
      const message = new Message(validMessage);
      const savedResponse = await message.save();

      req.socketServer.emit('new_message', savedResponse);

      res.json({
        status: 'success',
        payload: savedResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
