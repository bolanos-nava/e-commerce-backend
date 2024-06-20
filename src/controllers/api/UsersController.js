import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class UsersController extends BaseController {
  /** @type UsersServiceType */
  #usersService;

  constructor(usersService) {
    super();
    this.#usersService = usersService;
  }

  /**
   * Endpoint executed after authenticating with Passport
   *
   * @type {ExpressType['RequestHandler']}
   */
  registerUser = async (req, res, next) => {
    res.status(201).send({ status: 'created' });
  };
}
