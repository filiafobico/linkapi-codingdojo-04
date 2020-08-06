const COLLECTION = 'car';

class Cars {
  constructor(cars) {
    if (cars) {
      this._cars = this._fitCars(cars);
    }
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

  async getAll(param = {}) {
    const cars = await global.db
      .collection(this._choseTable(param))
      .find(this._makeFilter(param))
      .toArray();

    if (cars.length) {
      return { response: cars, error: null };
    }
    return { response: [], error: null };
  }

  _choseTable(param = {}) {
    switch (param['category']) {
      case 'juiz':
        return 'vwNotificaJuiz';
      case 'condutor':
        return 'vwNotificaCondutor';
      case 'proprietario':
        return 'vwNotificaProprietario';
      case 'receita':
        return 'vwNotificaReceitaFederal';
      case 'fiduciaria':
        return 'vwNotificaRestricaoFiduciaria';
      case 'roubo':
        return 'vwRouboFurto';
      default:
        return 'vwCars';
    }
  }

  _makeFilter(param = {}) {
    let filter = {};
    return filter;
  }

  _fitCars(cars) {
    for (let car of cars) {
      car.notificado = this._rulesToNotificado(car);
      car.classificado = "Não Classificado";
    }
    return cars;
  }

  _rulesToNotificado(car) {
    if (new Date(car.datahorarecolhimento) < new Date('2016-09-07')) {
      return "Não";
    }
    return car.notificado;
  }
}

module.exports = Cars;