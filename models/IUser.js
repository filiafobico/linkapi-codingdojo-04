const ObjectId = require('mongodb').ObjectId;
const { t } = require('typy');
const bcrypt = require('bcryptjs')

class IUser {

  constructor({ _id, name, type, cpf, password }) {
    this._id = _id;
    this.name = name;
    this.type = type;
    this.cpf = cpf;
    this.password = password;
  }

  async isValidForInsert() {
    if (!this.validPassword) {
      return false;
    }
    this.password = await this.encriptPassword();
    return this.validName() &&
      this.validType() &&
      this.validCpf();
  }

  isValidForUpdate() {
    return this.validId() &&
      (this.name ? this.validName() : delete this.name) &&
      (this.type ? this.validType() : delete this.type) &&
      (this.cpf ? this.validCpf() : delete this.cpf) &&
      (this.password ? this.validPassword() : delete this.password) &&
      Object.keys(this).length > 1
  }

  validName() {
    return t(this.name).isString;
  }

  validType() {
    return t(this.type).isString;
  }

  validId() {
    return t(this._id).isObjectId;
  }

  validCpf() {
    return t(this.cpf).isCpf;
  }

  validPassword() {
    return t(this.password).isString;
  }

  async encriptPassword() {
    return await bcrypt.hash(this.password, 10);
  }

  getObjectId() {
    return ObjectId(this._id);
  }
}

module.exports = IUser;