const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/passport/auth');

router.post('/', auth(), (req, res) => {
  const { password, ...userWithoutPassword } = req.user[0];
  res.status(200).json({
    response: [userWithoutPassword],
    error: null
  });
});

router.delete('/', (req, res) => {
  req.logout();
  res.status(200).json({
    response: 'OK',
    error: null
  });
});

module.exports = router;