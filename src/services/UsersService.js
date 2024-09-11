import { logger } from '../configs/index.js';

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
   * @returns Result of deleting inactive users
   */
  async deleteInactiveUsers(numMilliseconds) {
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

  updateLastConnection(email) {
    logger.info(`Updating last connection for user with email: ${email}`);
    return this.#usersDao.update({ email }, { lastActiveAt: new Date() });
  }

  updateByEmail(email, newData) {
    return this.#usersDao.update({ email }, newData);
  }
}
