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

  async notify(setFields = {}) {
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
    return await this.notify({ restrjudicial: NOTIFIED });
  }

  async notifyComprador() {
    return await this.notify({ restrcomunicacaovenda: NOTIFIED });
  }

  async notifyProprietario() {
    return await this.notify({ restrcomunicacaovenda: NOTIFIED });
  }

  async notifyReceita() {
    return await this.notify({ restrreceitafederal: NOTIFIED });
  }

  async notifyFiduciaria() {
    return await this.notify({ restralienacaofiduciaria: NOTIFIED });
  }
}

module.exports = Car;