const router = require('express').Router();

const ensureLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(null, req.user);
  } else {
    res.redirect('/auth/login');
  }
}

const ensureLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/chatroom');
  } else {
    next(null);
  }
}

module.exports = { ensureLoggedIn, ensureLoggedOut };