/**
 * @typedef {import('../../types').UserType} UserType
 * @typedef {import('../../types').IUser} IUser
 * @typedef {import('../../types').IUserModel} IUserModel
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('mongoose').FilterQuery<IUser>} FilterQueryUser
 */

export class UsersMongoDao {
  /** @type IUserModel */
  #User;

  /**
   * Constructs a new users service
   *
   * @param {IUserModel} User - User model
   */
  constructor(User) {
    this.#User = User;
  }

  /**
   * Returns a user from the database
   *
   * @param {FilterQueryUser} filter -
   * @param {{throws?: boolean}} options - Options.
   * - throws: Throws exception if user not found
   * @returns User from database
   */
  async get(filter, { throws = false } = {}) {
    return throws
      ? this.#User.findOneAndThrow(filter, { errorMessage: 'User not found' })
      : this.#User.findOne(filter);
  }

  /**
   * Saves a new user to the database
   *
   * @param {UserType} request
   * @returns New user object
   */
  async save(request) {
    return new this.#User(request).save();
  }
}
