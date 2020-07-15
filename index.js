const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { isLoggedIn } = require('./middleware/passport/auth');

// config
app.use(bodyParser.json({ limit: '100kb' }));
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

// passport
app.use(session({
  secret: 'CoronaNaPrf@2020',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

module.exports = app;