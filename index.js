const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// config
app.use(bodyParser.json({ limit: '100kb' }));
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));


// routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/cars', require('./routes/cars'));
app.use('/car', require('./routes/car'));
app.use('/auction', require('./routes/auction'));

module.exports = app;