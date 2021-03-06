const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// config
app.use(bodyParser.json({ limit: '100kb' }));
app.use(cors());

// routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/wallet', require('./routes/wallet'));

module.exports = app;
