const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/passport/auth');

router.post('/', auth(), (req, res) => {
  const { password, ...userWithoutPassword } = req.user[0];
  res.status(200).json(userWithoutPassword);
});

router.delete('/', function(req, res){
  req.logout();
  res.sendStatus(200);
});

module.exports = router;