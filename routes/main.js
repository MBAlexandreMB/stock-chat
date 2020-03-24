const router = require('express').Router();
const { ensureLoggedIn, ensureLoggedOut } = require('../config/utils');
const Room = require('../models/room');

router.get('/', (req, res) => {
  res.redirect('/auth/signup');
});

router.get('/chatroom', 
(req, res, next) => { ensureLoggedIn(req, res, next) } ,(req, res) => {
    Room.find()
    .then(rooms => {
      if (req.user) {
        res.render('chatroom', { user: req.user.username, rooms, currentRoom: 'Main' });
      } else {
        res.render('chatroom');
      }
    })
    .catch(e => console.log(e));

});

router.post('/chatroom', (req, res, next) => {
  res.render('chatroom', { user: req.body.username });
});

router.get('/auth/signup', (req, res, next) => { ensureLoggedOut(req, res, next) }, (req, res) => {
  res.render('signup');
});

router.get('/auth/login', (req, res, next) => { ensureLoggedOut(req, res, next) }, (req, res) => {
  res.render('login');
});

module.exports = router;