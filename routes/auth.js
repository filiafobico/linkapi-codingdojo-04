const express = require('express');
const router = express.Router();
const User = require('../models/user/User');
const bcrypt = require('bcryptjs');
// const { auth } = require('../middleware/passport/auth');
const jwt = require("jsonwebtoken");


router.post('/', async (req, res) => {  
  const users = await new User({}).getAll({ cpf: req.body.username });
  const error = { response: [], error: "invalid username or password" };
  if (Array.isArray(users) && users.length) {
    if (bcrypt.compareSync(req.body.password, users[0].password)) {
      const id = users[0].id;
      const token = jwt.sign({ id }, "1q2w3e4r", {
        expiresIn: 600 // expires in 5min
      });
      delete users[0].password;
      res.status(200).json({
        response: {token, user:users[0]},
        error: null
      });
    } else {
      res.status(200).json({
        response: null,
        error: 'Usuario invalido'
      });
    }
  }
  console.log(JSON.stringify(users));
  

});

router.delete('/', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;