const router = require('express').Router();

const Car = require('../models/car/Car');

function choseFunction(category) {
  switch (category) {
    case 'juiz':
      return 'notifyJuiz';
    case 'comprador':
      return 'notifyComprador';
    case 'proprietario':
      return 'notifyProprietario';
    case 'receita':
      return 'notifyReceita';
    case 'fiduciaria':
      return 'notifyFiduciaria';
    default:
      throw Error('Categoria inexistente');
  }
}

router.put('/notify/:category/:_id', async (req, res) => {
  let notifyFunction;

  if (!req.params._id) {
    res.status(400).send({ response: null, error: 'ID not passed' });
    return;
  }

  try {
    notifyFunction = choseFunction(req.params.category);
  } catch(error) {
    res.status(400).send({ response: null, error })
    return;
  }

  const response = await new Car(req.params._id)[notifyFunction]();
  res.status(200).send(response);
});

module.exports = router;