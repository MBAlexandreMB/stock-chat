const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.serializeUser((username, cb) => {
    cb(null, username);
});

passport.deserializeUser((username, cb) => {
  User.findOne({ username })
    .then((user) => {
        cb(null, user);
    })
    .catch((err) => console.log(err));
});

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, next) => {
      User.findOne({ username },
        (err, user) => {
          if (err) {
            return next(err);
          }

          if (!user || !bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
              message: 'Incorrect username or password'
            });
          }

          return next(null, user.username);
        }
      );
    }
  )
);

module.exports = passport;