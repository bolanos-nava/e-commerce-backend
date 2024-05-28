import { User } from '../daos/models/index.js';

/**
 * @typedef {import('../types').UserType} UserType
 */

export default class UsersService {
  /**
   * Fetches user by email
   *
   * @param {String} email Email of user
   * @returns User from database
   */
  async getUserByEmail(email, { throws = false } = {}) {
    return throws
      ? User.findOneAndThrow(
          { email },
          { property: { name: 'email', value: email } },
        )
      : User.findByEmail(email);
  }

  /**
   * Saves a new user to the database
   *
   * @param {UserType} request
   * @returns
   */
  async saveNewUser(request) {
    const user = new User(request);
    console.log(user.email);
    return user.save();
  }
}
