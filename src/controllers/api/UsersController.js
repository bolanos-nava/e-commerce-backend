import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ServicesType['users']} UsersServiceType
 */

export default class UsersController extends BaseController {
  /** @type UsersServiceType */
  #usersService;

  /**
   * Constructs a new users controller
   *
   * @param {UsersServiceType} usersService - Users service instance
   */
  constructor(usersService) {
    super();
    this.#usersService = usersService;
  }

  /**
   * Endpoint that executes after creating a user with Passport
   *
   * @type {ExpressType['RequestHandler']}
   */
  create(_, res, __) {
    res.status(201).json({ status: 'created' });
  }

  /**
   * Endpoint to delete inactive users
   */
  async deleteInactiveUsers(req, res, next) {
    try {
      // const numMilliseconds = 1000 * 60 * 60 * 24 * 2;
      const numMilliseconds = 1000 * 60 * 2; // 2 minutes
      await this.#usersService.deleteInactiveUsers(numMilliseconds);
    } catch (error) {
      next(error);
    }
  }
}
