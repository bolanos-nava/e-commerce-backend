/**
 * @typedef {import('../../types').UserType} UserType
 * @typedef {import('../../types').IUser} IUser
 * @typedef {import('../../types').IUserModel} IUserModel
 * @typedef {import('../../types').ICartModel} ICartModel
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('mongoose').FilterQuery<IUser>} FilterQueryUser
 */

export class UsersMongoDao {
  /** @type IUserModel */
  #User;
  /** @type ICartModel */
  #Cart;

  /**
   * Constructs a new users service
   *
   * @param {IUserModel} User - User model
   * @param {ICartModel} Cart - Cart model
   */
  constructor(User, Cart) {
    this.#User = User;
    this.#Cart = Cart;
  }

  /**
   * Deletes users from database who haven't logged in for more than the specified time
   *
   * @param {number} numMilliseconds - Number of milliseconds of inactivity
   */
  async deleteInactiveUsers(numMilliseconds) {
    /* @type  */
    const inactiveUsers = await this.#User.find(
      {
        lastActiveAt: {
          $lt: new Date(Date.now() - numMilliseconds),
        },
      },
      // { _id: 1, cart: 1 },
    );

    const usersToDelete = inactiveUsers.map((user) => user.id);
    const cartsToDelete = inactiveUsers.map((user) => user.cart);

    await this.#User.deleteMany({ _id: { $in: usersToDelete } });
    await this.#Cart.deleteMany({ _id: { $in: cartsToDelete } });
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
    // TODO: implement transactions
    const user = new this.#User(request);
    const cart = new this.#Cart({ user: user.id });
    user.cart = cart._id;
    await cart.save();
    return user.save();
  }

  async update(filter, newData) {
    const user = await this.#User.findOneAndThrow(filter);
    const newUser = Object.assign(user, newData);
    return newUser.save();
  }
}
