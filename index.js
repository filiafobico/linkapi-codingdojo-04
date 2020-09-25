const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const { verifyJWT } = require('./middleware/jwt');

// config
app.use(bodyParser.json({ limit: '100kb' }));
app.use(cors());

// routes
app.use('/auth', require('./routes/auth'));
app.use('/user', verifyJWT, require('./routes/user'));
app.use('/cars', verifyJWT, require('./routes/cars'));
app.use('/car', verifyJWT, require('./routes/car'));
app.use('/auction', verifyJWT, require('./routes/auction'));

module.exports = app;
