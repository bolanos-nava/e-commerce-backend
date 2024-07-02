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
   * Fetches user by email
   *
   * @param {String} email - Email of user
   * @param {{throws?: boolean}} options - Options. throws: Throws exception if user not found
   * @returns User from database
   */
  async getUserByEmail(email, { throws = false } = {}) {
    return throws
      ? this.#User.findOneAndThrow(
          { email },
          { errorMessage: `User with email ${email} not found` },
        )
      : this.#User.findByEmail(email);
  }

  /**
   * Fetches user by some field
   *
   * @param {FilterQueryUser} filter - Query object
   * @param {{throws?: boolean}} options - Options object
   * @returns
   */
  async getUserBy(filter, { throws = false } = {}) {
    return throws
      ? this.#User.findOneAndThrow(filter, { errorMessage: 'User not found' })
      : this.#User.findOne(filter);
  }

  /**
   * Fetches user by id
   *
   * @param {MongoIdType} id - User id
   * @param {{throws?: boolean}} options - Options object
   * @returns
   */
  async getUserById(id, { throws = false } = {}) {
    return throws ? this.#User.findByIdAndThrow(id) : this.#User.findById(id);
  }

  /**
   * Saves a new user to the database
   *
   * @param {UserType} request
   * @returns New user object
   */
  async saveNewUser(request) {
    return new this.#User(request).save();
  }
}
