const router = require('express').Router();

const Car = require('../models/car/Car');
const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  var token = req.headers["token"];
  if (!token) return res.status(400).send({ message: "Sem token não entra." });

  jwt.verify(token, "1q2w3e4r", function(err, decoded) {
    if (err)
      return res.status(400).send({ message: "token invalido ou expirado" });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}
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

router.put('/notify/:category/:_id',verifyJWT, async (req, res) => {
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