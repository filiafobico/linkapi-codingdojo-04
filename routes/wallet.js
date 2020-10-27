const express = require("express");
const router = express.Router();
const { verifyJWT } = require('../middleware/jwt');

const Wallet = require('../models/wallet/Wallet');
const User = require('../models/user/User');

router.get('/coin', verifyJWT, async (req, res) => {
  let response = {};
  let status = 200;

  const user = await new User({ _id: req.userId }).getById();

  if (user.role !== 'user') {
    return res.status(400).send({ error: 'Não é usuário'});
  }

  response = await new Wallet({}).getCountCoin(user._id.toString());

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.get('/:_id?', async (req, res) => {
  let response = {};
  let status = 200;

  if (req.params._id) {
    response = await new Wallet({ _id: req.params._id }).getById();
  } else {
    response = await new Wallet({}).getAll(req.query);
  }

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.post('/', async (req, res) => {
  const wallet = new Wallet(req.body);
  const response = await wallet.insert();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.put('/:_id?', verifyJWT, async (req, res) => {
  const user = await new User({ _id: req.userId }).getById();

  if (user.role !== 'admin') {
    return res.status(400).send({ error: 'Não é admin'});
  }

  const wallet = req.body;
  wallet._id = req.params._id;
  const response = await new Wallet(wallet).update();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.delete('/:_id?', async (req, res) => {
  const response = await new Wallet({ _id: req.params._id }).delete();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

module.exports = router;