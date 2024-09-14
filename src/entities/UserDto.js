/**
 * @typedef {import('../types').IUser} IUser
 */

export default class UserDto {
  /**
   * Constructs a new user object from the given user data.
   *
   * @param {IUser} user - The user data to create the user object from.
   */
  constructor(user) {
    this._id =
      (typeof user.id === 'string' && user.id) ||
      (typeof user._id === 'string' ? user._id : user._id?.toString());
    this.firstName = user.firstName.trim();
    this.lastName = user.lastName.trim();
    this.fullName = `${this.firstName}${this.lastName ? ` ${this.lastName}` : ''}`;
    this.cart = user.cart;
    this.email = user.email;
    this.role = user.role;
  }
}
