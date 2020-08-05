const COLLECTION = 'car';

class Cars {
  constructor(cars) {
    this._cars = cars;
  }

  get collection() {
    return COLLECTION;
  }

  async insert() {
    if (!this._cars.length) {
      return { response: [], error: 'Nenhum carro passado para ser inserido' };
    }
    const carsToInsert = [ ...this._cars ];

    for (let car of carsToInsert) {
      try {
        await global.db
          .collection(this.collection)
          .insertOne(car);
      } catch (err) {
        // index duplicado
        if (err.code === 11000) {
          this._cars.splice(this._cars.findIndex( c => c.numrecolhimento === car.numrecolhimento ), 1);
        } else {
          return { response: this._cars, error: 'Erro desconhecido, contate o administrador' };
        }
      }
    }

    return { response: this._cars, error: null };
  }
}

module.exports = Cars;