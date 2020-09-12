const express = require('express');
const Auction = require('../models/auction/Auction');
const router = express.Router();

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
  if (req.params._id) {
    res.status(200).send(await new Auction().getCarsInAuction(req.params._id));
    return;
  }
  res.status(200).send(await new Auction().getAuctions());
});

router.get('/prospection/:dataPrevista', verifyJWT,async (req, res) => {
  res.status(200).send(await new Auction().list(req.params.dataPrevista));
});

router.post('/prospection/:dataPrevista', verifyJWT,async (req, res) => {
  const response = await new Auction().create(req.params.dataPrevista);
  res.status(response.error ? 400 : 200).send(response);
});

module.exports = router;