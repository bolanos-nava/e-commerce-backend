import { logger } from '../configs/index.js';
import { ResourceNotFoundError } from '../customErrors/index.js';

/**
 * @typedef {import('../types').MongoDaosType} DaosType
 * @typedef {DaosType['users']} UsersDao
 * @typedef {import('../types').UserType} UserType
 * @typedef {import('../types').MongoIdType} MongoIdType
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
   * Deletes a user
   *
   * @param {MongoIdType} userId
   * @returns
   */
  delete(userId) {
    return this.#usersDao.delete(userId);
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

  /**
   * Returns a user
   *
   * @param {object} filter - Object containing query conditions
   * @returns User, or throws if user not found
   */
  get(filter, { throws = false } = {}) {
    return this.#usersDao.get(filter, { throws });
  }

  /**
   * Returns list of users
   *
   * @returns List of users
   */
  async getAll() {
    const users = await this.#usersDao.getAll();
    return { users };
  }

  /**
   * Returns a user by email
   *
   * @param {string} email - Email of the user
   * @param {boolean} [throws=false] - Throws an error if user not found
   * @returns User, or throws if user not found
   */
  getByEmail(email, { throws = false } = {}) {
    return this.#usersDao.get({ email }, { throws });
  }

  /**
   * Returns a user by its id
   *
   * @param {MongoIdType} id - ID of the user
   * @param {{throws?: boolean;}} options - Throws an error if user not found
   */
  getById(id, { throws = false } = {}) {
    return this.#usersDao.get({ _id: id }, { throws });
  }

  /**
   * Saves new user
   *
   * @param {UserType} user - User data
   */
  save(user) {
    return this.#usersDao.save(user);
  }

  /**
   * Updates user's last connection
   *
   * @param {string} email - Email of the user
   * @returns Updated user, or null if user not found
   */
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
