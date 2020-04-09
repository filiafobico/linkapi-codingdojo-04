const IUser = require('./IUser');

class User {

  COLLECTION = 'user';

  constructor({ _id, name, type, cpf }) {
    this.user = new IUser({ _id, name, type, cpf });
  }

  async getById() {
    if (!this.user.validId()) {
      return { err: 1, msg: "invalid schema" };
    }

    const user = await global.db
      .collection(this.COLLECTION)
      .findOne({ _id: this.user.getObjectId() });

    this.user = new IUser(user);
    return this.user;
  }

  async insert() {
    if (!this.user.isValidForInsert()) {
      return { err: 1, msg: "invalid schema" };
    }

    const res = await global.db
      .collection(this.COLLECTION)
      .insertOne(this.user);

    this.user._id = res.insertedId.toString();
    return this.user;
  }

  async update() {
    if (!this.user.isValidForUpdate()) {
      return { err: 1, msg: "invalid schema" };
    }
    const _id = this.user.getObjectId();
    delete this.user._id;

    await global.db
      .collection(this.COLLECTION)
      .updateOne({ _id }, { $set: this.user });

    this.user._id = _id.toString();
    return await this.getById();
  }
}

module.exports = User;