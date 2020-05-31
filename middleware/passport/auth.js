const passport = require('passport');

const auth = () => {
  return (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) {
        res.status(401).json(error);
      }
      req.login(user, (error) => {
        if (error) {
          return next(error);
        }
        next();
      });
    })(req, res, next);
  }
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ "err": 4, "msg": "not authenticated" })
}

module.exports = { auth, isLoggedIn };