const IUser = require('./IUser');

const COLLECTION = 'user';
class User {

  constructor({ _id, login, role, password }) {
    this.user = new IUser({ _id, login, role, password });
  }

  get collection() {
    return COLLECTION;
  }

  async getById() {
    if (!this.user.validId()) {
      return { err: 1, msg: "invalid schema" };
    }

    const user = await global.db
      .collection(this.collection)
      .findOne({ _id: this.user.getObjectId() });

    if (user) {
      this.user = new IUser(user);
      return this.user;
    }
    return { err: 2, msg: "user not found" };
  }

  async getAll(param = {}) {
    const users = await global.db
      .collection(this.collection)
      .find(param)
      .toArray();

    if (users.length) {
      return users.map( user => new IUser(user) );
    }
    return [];
  }

  async insert() {
    if (!await this.user.isValidForInsert()) {
      return { err: 1, msg: "invalid schema" };
    }
    this.user.password = await this.user.encriptPassword(this.user.password);
    const res = await global.db
      .collection(this.collection)
      .insertOne(this.user);

    this.user._id = res.insertedId.toString();
    return this.user;
  }

  async update() {
    if (!this.user.isValidForUpdate()) {
      return { err: 1, msg: "invalid schema" };
    }
    const _id = this.user.getObjectId();
    this.user.password = await this.user.encriptPassword(this.user.password);
    delete this.user._id;

    await global.db
      .collection(this.collection)
      .updateOne({ _id }, { $set: this.user });

    this.user._id = _id.toString();
    return await this.getById();
  }

  async delete() {
    if (!this.user.validId()) {
      return { err: 1, msg: "invalid schema" };
    }

    await global.db
    .collection(this.collection)
    .deleteOne({ _id: this.user.getObjectId() });

    return true;
  }
}

module.exports = User;