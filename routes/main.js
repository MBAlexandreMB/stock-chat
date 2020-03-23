const router = require('express').Router();
const { ensureLoggedIn, ensureLoggedOut } = require('../config/utils');

router.get('/', (req, res) => {
  res.redirect('/auth/signup');
});

router.get('/chatroom', 
(req, res, next) => { ensureLoggedIn(req, res, next) } ,(req, res) => {
  if (req.user) {
    res.render('chatroom', { user: req.user });
  } else {
    res.render('chatroom');
  }
});

router.get('/auth/signup', (req, res, next) => { ensureLoggedOut(req, res, next) }, (req, res) => {
  res.render('signup');
});

router.get('/auth/login', (req, res, next) => { ensureLoggedOut(req, res, next) }, (req, res) => {
  res.render('login');
});

module.exports = router;