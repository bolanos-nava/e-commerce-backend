import { User } from '../daos/models/index.js';

/**
 * @typedef {import('../types').UserType} UserType
 * @typedef {import('../types').IUser} IUser
 * @typedef {import('mongoose').FilterQuery<IUser>} FilterQueryUser
 */

export default class UsersService {
  /**
   * Fetches user by email
   *
   * @param {String} email Email of user
   * @param {{throws?: boolean}} options Options. throws: Throws exception if user not found
   * @returns User from database
   */
  async getUserByEmail(email, { throws = false } = {}) {
    return throws
      ? User.findOneAndThrow(
          { email },
          { errorMessage: `User with email ${email} not found` },
        )
      : User.findByEmail(email);
  }

  /**
   *
   * @param {FilterQueryUser} filter
   * @param {{throws?: boolean}} options
   * @returns
   */
  async getUserBy(filter, { throws = false } = {}) {
    return throws
      ? User.findOneAndThrow(filter, { errorMessage: 'User not found' })
      : User.findOne(filter);
  }

  async getUserById(id, { throws = false } = {}) {
    return throws ? User.findByIdAndThrow(id) : User.findById(id);
  }

  /**
   * Saves a new user to the database
   *
   * @param {UserType} request
   * @returns
   */
  async saveNewUser(request) {
    return new User(request).save();
  }
}
