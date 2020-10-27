const ObjectId = require('mongodb').ObjectId;
const { t } = require('typy');
const bcrypt = require('bcryptjs');

class IUser {

  constructor({ _id, login, role, password }) {
    this._id = _id;
    this.login = login;
    this.role = role;
    this.password = password;
  }

  async isValidForInsert() {
    if (!this.validPassword()) {
      return false;
    }

    return this.validLogin() && this.validRole();
  }

  isValidForUpdate() {
    return this.validId() &&
      (this.login ? this.validLogin() : delete this.login) &&
      (this.role ? this.validCpf() : delete this.role) &&
      (this.password ? this.validPassword() : delete this.password) &&
      Object.keys(this).length > 1
  }

  validLogin() {
    return t(this.login).isString;
  }

  validId() {
    return t(this._id).isObjectId;
  }

  validRole() {
    return t(this.role).isString &&
      ['admin', 'user'].includes(this.role);
  }

  validPassword() {
    return t(this.password).isString;
  }

  async encriptPassword(password) {
    if (password) {
      return await bcrypt.hash(password, 10);
    }
  }

  getObjectId() {
    return ObjectId(this._id);
  }
}

module.exports = IUser;