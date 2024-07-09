export default class UserDto {
  constructor(user) {
    this._id =
      (typeof user.id === 'string' && user.id) ||
      (typeof user._id === 'string' ? user._id : user._id?.toString());
    this.cart = user.cart;
    this.email = user.email;
    this.role = user.role;
  }
}
