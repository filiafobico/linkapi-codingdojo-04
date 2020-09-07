const express = require('express');
const Auction = require('../models/auction/Auction');
const router = express.Router();

router.get('/:_id?', async (req, res) => {
  if (req.params._id) {
    res.status(200).send(await new Auction().getCarsInAuction(req.params._id));
    return;
  }
  res.status(200).send(await new Auction().getAuctions());
});

router.get('/prospection/:dataPrevista', async (req, res) => {
  res.status(200).send(await new Auction().list(req.params.dataPrevista));
});

router.post('/prospection/:dataPrevista', async (req, res) => {
  const response = await new Auction().create(req.params.dataPrevista);
  res.status(response.error ? 400 : 200).send(response);
});

module.exports = router;