export default class UserCto {
  constructor(user) {
    this._id = user.id || user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
  }
}
