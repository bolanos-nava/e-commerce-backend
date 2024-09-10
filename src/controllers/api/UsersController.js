import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class UsersController extends BaseController {
  /**
   * Endpoint executed after authenticating with Passport
   *
   * @type {ExpressType['RequestHandler']}
   */
  create(_, res, __) {
    res.status(201).json({ status: 'created' });
  }
}
