const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const userOrError = await new User({}).getAll({ cpf: username });

    if (Array.isArray(userOrError)) {
      if (bcrypt.compareSync(password, userOrError[0].password)) {
        return done(null, userOrError);
      } else {
        return done({ err: 3, msg: "password incorrect" }, false);
      }
    } else {
      return done(userOrError, false);
    }
  }
));

passport.serializeUser((user, done) => {
  if (user) done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});