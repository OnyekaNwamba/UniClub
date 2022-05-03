export class User {
  constructor(id, firstName, lastName, email, password) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password
  }

  static fromApi(item) {
    return new User(item.id, item.firstName, item.lastName, item.email, item.password)
  }
}