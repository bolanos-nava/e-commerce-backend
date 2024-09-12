import { logger } from '../configs/index.js';
import { ResourceNotFoundError } from '../customErrors/index.js';

/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['users']} UsersDao
 */

export default class UsersService {
  /** @type UsersDao */
  #usersDao;

  /**
   * Constructs a new users service with injected DAO of users
   *
   * @param {UsersDao} usersDao
   */
  constructor(usersDao) {
    this.#usersDao = usersDao;
  }

  /**
   * Deletes users who have been inactive for the specified time
   *
   * @param {number} numMilliseconds - Number of milliseconds of inactivity
   * @returns Number of deleted users
   */
  deleteInactiveUsers(numMilliseconds) {
    return this.#usersDao.deleteInactiveUsers(numMilliseconds);
  }

  getByEmail(email, { throws = false } = {}) {
    return this.#usersDao.get({ email }, { throws });
  }

  getById(id, { throws = false } = {}) {
    return this.#usersDao.get({ _id: id }, { throws });
  }

  get(filter, { throws = false } = {}) {
    return this.#usersDao.get(filter, { throws });
  }

  save(request) {
    return this.#usersDao.save(request);
  }

  async updateLastConnection(email) {
    logger.debug(`Updating last connection for user with email: ${email}`);
    try {
      return await this.#usersDao.update(
        { email },
        { lastActiveAt: new Date() },
      );
    } catch (error) {
      logger.debug(`User with email ${email} doesn't exist`);
      if (error instanceof ResourceNotFoundError) {
        return null;
      }
      throw error;
    }
  }

  updateByEmail(email, newData) {
    return this.#usersDao.update({ email }, newData);
  }
}
