const ObjectId = require('mongodb').ObjectId;
const { t } = require('typy');
const bcrypt = require('bcryptjs');

class IUser {

  constructor({ _id, user, coin, origin, create_by }) {
    this._id = _id;
    this.user = user;
    this.coin = coin;
    this.origin = origin;
    this.create_by = create_by;
    this.create_at = new Date();
  }

  async isValidForInsert() {
    if (!this.validCreateBy()) {
      return false;
    }

    return this.validCoin() && this.validOrigin();
  }

  isValidForUpdate() {
    return (this.user ? this.validUser() : delete this.user) &&
      (this.coin ? this.validCoin() : delete this.coin) &&
      (this.origin ? this.validOrigin() : delete this.origin) &&
      (this.create_by ? this.validCreateBy() : delete this.create_by) &&
      Object.keys(this).length > 1
  }

  validId() {
    return t(this._id).isObjectId;
  }

  validCoin() {
    return t(this.coin).isNumber;
  }

  validUser() {
    return t(this.user).isObjectId;
  }

  validOrigin() {
    return t(this.origin).isString;
  }

  validCreateBy() {
    return t(this.create_by).isObjectId;
  }

  getObjectId(id) {
    return ObjectId(id);
  }
}

module.exports = IUser;