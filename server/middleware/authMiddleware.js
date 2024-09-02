const passport = require('./passport');

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "An error occurred during authentication. Please check your token." });
    }
    if (!user) {
      return res.status(401).json({ message: "missing credentials, check your username or password and try again" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticate;