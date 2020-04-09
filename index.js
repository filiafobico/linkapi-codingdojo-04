const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// config
app.use(bodyParser.json({ limit: '100kb' }));

// routes
app.use('/user', require('./routes/user'));

module.exports = app;