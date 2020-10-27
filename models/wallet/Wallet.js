const IWallet = require('./IWallet');

const COLLECTION = 'wallet';
class Wallet {

  constructor({ _id, user, coin, origin, create_by }) {
    this.wallet = new IWallet({ _id, user, coin, origin, create_by });
  }

  get collection() {
    return COLLECTION;
  }

  async getById() {
    if (!this.wallet.validId()) {
      return { err: 1, msg: "invalid schema" };
    }

    const wallet = await global.db
      .collection(this.collection)
      .findOne({ _id: this.wallet.getObjectId(this.wallet._id) });

    if (wallet) {
      this.wallet = new IWallet(wallet);
      return this.wallet;
    }
    return { err: 2, msg: "wallet not found" };
  }

  async getCountCoin(user) {
    const wallet = await global.db
      .collection('vwwCountCoin')
      .findOne({ _id: user });

    return wallet;
  }

  async getAll(param = {}) {
    const wallets = await global.db
      .collection(this.collection)
      .find(param)
      .toArray();

    if (wallets.length) {
      return wallets.map( wallet => new IWallet(wallet) );
    }
    return [];
  }

  async insert() {
    if (!await this.wallet.isValidForInsert()) {
      return { err: 1, msg: "invalid schema" };
    }
    const res = await global.db
      .collection(this.collection)
      .insertOne(this.wallet);

    this.wallet._id = res.insertedId.toString();
    return this.wallet;
  }

  async update() {
    if (!this.wallet.isValidForUpdate()) {
      return { err: 1, msg: "invalid schema" };
    }
    const _id = this.wallet.getObjectId(this.wallet._id);
    delete this.wallet._id;

    await global.db
      .collection(this.collection)
      .updateOne({ _id }, { $set: this.wallet });

    this.wallet._id = _id.toString();
    return await this.getById();
  }

  async delete() {
    if (!this.wallet.validId()) {
      return { err: 1, msg: "invalid schema" };
    }

    await global.db
    .collection(this.collection)
    .deleteOne({ _id: this.wallet.getObjectId() });

    return true;
  }
}

module.exports = Wallet;