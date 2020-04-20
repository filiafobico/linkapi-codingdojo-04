const IUser = require('./IUser');

const COLLECTION = 'user';
class User {

  constructor({ _id, name, type, cpf }) {
    this.user = new IUser({ _id, name, type, cpf });
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

    this.user = new IUser(user);
    return this.user;
  }

  async getAll() {
    const users = await global.db
      .collection(this.collection)
      .find({})
      .toArray();
    
    return users.map( user => new IUser(user) );
  }

  async insert() {
    if (!this.user.isValidForInsert()) {
      return { err: 1, msg: "invalid schema" };
    }

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
    delete this.user._id;

    await global.db
      .collection(this.collection)
      .updateOne({ _id }, { $set: this.user });

    this.user._id = _id.toString();
    return await this.getById();
  }
}

module.exports = User;