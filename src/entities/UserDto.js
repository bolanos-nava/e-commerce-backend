export default class UserDto {
  constructor(user) {
    this._id = user.id || user._id;
    // this.cartId = user.cartId;
    this.email = user.email;
    this.role = user.role;
  }
}
