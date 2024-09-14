import { logger } from '../configs/index.js';
import { ResourceNotFoundError } from '../customErrors/index.js';
import UserDto from '../entities/UserDto.js';

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
  async delete(userId) {
    const user = await this.#usersDao.delete(userId);
    return { user };
  }

  /**
   * Deletes users who have been inactive for the specified time
   *
   * @param {number} numMilliseconds - Number of milliseconds of inactivity
   * @returns Number of deleted users
   */
  async deleteInactiveUsers(numMilliseconds) {
    const inactiveUsers =
      await this.#usersDao.deleteInactiveUsers(numMilliseconds);
    return { users: inactiveUsers };
  }

  /**
   * Returns a user
   *
   * @param {object} filter - Object containing query conditions
   * @returns User, or throws if user not found
   */
  async get(filter, { throws = false } = {}) {
    const user = this.#usersDao.get(filter, { throws });
    return { user };
  }

  /**
   * Returns list of users
   *
   * @returns List of users
   */
  async getAll() {
    const users = await this.#usersDao.getAll();
    return { users: users.map((user) => new UserDto(user)) };
  }

  /**
   * Returns a user by email
   *
   * @param {string} email - Email of the user
   * @param {boolean} [throws=false] - Throws an error if user not found
   * @returns User, or throws if user not found
   */
  async getByEmail(email, { throws = false } = {}) {
    const user = await this.#usersDao.get({ email }, { throws });
    return { user };
  }

  /**
   * Returns a user by its id
   *
   * @param {MongoIdType} id - ID of the user
   * @param {{throws?: boolean;}} options - Throws an error if user not found
   */
  async getById(id, { throws = false } = {}) {
    const user = await this.#usersDao.get({ _id: id }, { throws });
    return { user };
  }

  async dtoWrapper(callback, ...args) {
    const { user } = await callback(...args);
    return { user: new UserDto(user) };
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
    logger.debug(`Updating last connection for user with email: ${email}`, {
      function: `${UsersService.name}::${this.updateLastConnection.name}`,
    });
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

  /**
   * Updates user by its email
   *
   * @param {string} email - Email of the user
   * @param {Partial<UserType>} newData - New user data
   * @returns Updated user
   */
  async updateByEmail(email, newData) {
    const newUser = await this.#usersDao.update({ email }, newData);
    return { user: newUser };
  }

  /**
   * Updates user by its id
   *
   * @param {MongoIdType} userId - Email of the user
   * @param {Partial<UserType>} newData - New user data
   * @returns Updated user
   */
  async updateById(userId, newData) {
    const newUser = await this.#usersDao.update({ _id: userId }, newData);
    return { user: newUser };
  }
}
