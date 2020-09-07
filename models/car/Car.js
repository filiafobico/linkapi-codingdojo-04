const ObjectId = require('mongodb').ObjectId;

const COLLECTION = 'car';
const NOTIFIED = 'Notificado';

class Car {
  constructor(_id) {
    this._id = _id;
  }

  get collection() {
    return COLLECTION;
  }

  async updateById(setFields = {}) {
    let _id;

    try {
      _id = ObjectId(`${this._id}`);
    } catch(err) {
      return { response: null, error: 'invalid _id' };
    }

    const res = await global.db
      .collection(this.collection)
      .updateOne({ _id }, { $set: setFields });

    if (!res.modifiedCount) {
      return { response: [], error: `No car with _id passed ${this._id}` };
    }
    return { response: [], error: null };
  }

  async notifyJuiz() {
    return await this.updateById({ restrjudicial: NOTIFIED });
  }

  async notifyComprador() {
    return await this.updateById({ restrcomunicacaovenda: NOTIFIED });
  }

  async notifyProprietario() {
    return await this.updateById({ restrcomunicacaovenda: NOTIFIED });
  }

  async notifyReceita() {
    return await this.updateById({ restrreceitafederal: NOTIFIED });
  }

  async notifyFiduciaria() {
    return await this.updateById({ restralienacaofiduciaria: NOTIFIED });
  }
}

module.exports = Car;