const Car = require('../car/Car');

const COLLECTION = 'auction';
class Auction {

  constructor() {

  }

  get collection() {
    return COLLECTION;
  }

  async list(dataPrevista) {
    const millisecondsOf60Days = 5184000000;

    const cars = await global.db
      .collection('vwAptoLeilao')
      .aggregate([
        {
          $addFields: {
            dateDiff: {
              $subtract: [
                new Date(dataPrevista),
                '$datahorarecolhimento'
              ]
            }
          }
        },
        {
          $match: {
            dateDiff: {
              $gte: millisecondsOf60Days
            }
          }
        },
        {
          $project: {
            dateDiff: 0
          }
        }
      ])
      .toArray();

    return { response: cars, error: null };
  }

  async create(dataPrevista) {
    const cars = await this.list(dataPrevista);

    if (!cars.response.length) {
      return { response: [], error: 'No cars available to auction in selected date' };
    }

    const idLelao = await global.db
      .collection(this.collection)
      .insertOne({ dataPrevista });

    for (let car of cars.response) {
      new Car(car._id).updateById({ leilao: idLelao.insertedId });
    }

    return { response: idLelao.insertedId, error: null };
  }
}

module.exports = Auction;