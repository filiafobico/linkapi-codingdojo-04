const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/user/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const users = await new User({}).getAll({ cpf: username });
    const error = { response: [], error: "invalid username or password" };

    if (Array.isArray(users) && users.length) {
      if (bcrypt.compareSync(password, users[0].password)) {
        return done(null, users);
      } else {
        return done(error, false);
      }
    } else {
      return done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  if (user) done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});