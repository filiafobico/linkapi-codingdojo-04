const express = require("express");
const router = express.Router();

const User = require('../models/user/User');

router.get('/:_id?', async (req, res) => {
  let response = {};
  let status = 200;

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

router.post('/', async (req, res) => {
  const user = new User(req.body);
  const response = await user.insert();
  let status = 200;

  if (response.err) {
    status = 400;
  }
  res.status(status).send(response);
});

router.put('/:_id?', async (req, res) => {
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