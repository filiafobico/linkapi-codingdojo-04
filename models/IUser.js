const ObjectId = require('mongodb').ObjectId;
const { t } = require('typy');

class IUser {

  constructor({ _id, name, type, cpf }) {
    this._id = _id;
    this.name = name;
    this.type = type;
    this.cpf = cpf;
  }

  isValidForInsert() {
    return this.validName() &&
      this.validType() &&
      this.validCpf();
  }

  isValidForUpdate() {
    return this.validId() &&
      (this.name ? this.validName() : delete this.name) &&
      (this.type ? this.validType() : delete this.type) &&
      (this.cpf ? this.validCpf() : delete this.cpf) &&
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

  getObjectId() {
    return ObjectId(this._id);
  }
}

module.exports = IUser;