/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import BaseController from './BaseController.js';
import { messageValidator } from '../../schemas/zod/message.validator.js';
import services from '../../services/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */
export default class MessagesController extends BaseController {
  /**
   * Creates a new message
   *
   * @type {ExpressType['RequestHandlerWS']}
   */
  async createMessage(req, res, next) {
    try {
      const { message: request } = req.body;
      const validMessage = messageValidator.parse(request);
      const savedResponse =
        await services.messages.createNewMessage(validMessage);

      req.socketServer.emit('new_message', savedResponse);

      res.status(201).json({
        status: 'success',
        payload: savedResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
