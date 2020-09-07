const express = require("express");
const router = express.Router();

const User = require('../models/user/User');
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
router.get('/:_id?', verifyJWT, async (req, res) => {
  let response = {};
  let status = 200;
  console.log('oi');
  
  if (req.params._id) {
    response = await new User({ _id: req.params._id }).getById();
  } else {
    response = await new User({}).getAll(req.query);
  }

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.post('/', verifyJWT,async (req, res) => {
  const user = new User(req.body);
  const response = await user.insert();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.put('/:_id?',verifyJWT, async (req, res) => {
  const user = req.body;
  user._id = req.params._id;
  const response = await new User(user).update();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.delete('/:_id?', async (req, res) => {
  const response = await new User({ _id: req.params._id }).delete();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

module.exports = router;