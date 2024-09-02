const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user'); 
const { handleAsync } = require('./handleAsync');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  const { result, error } = await handleAsync(() => User.findById(jwt_payload.id));

    if (error) {
        return done(error, false);
    }

    if (result) {
        return done(null, result);
    } else {
        return done(null, false);
    }
}));

module.exports = passport;