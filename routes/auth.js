const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('../config/passport');

const User = require('../models/user');

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  
  //Checks for empty usernames
  if (!username || username === '') {
    res.render('signup', { message: 'Username is required!' });
    return;
  }
  
  if (username.toUpperCase() === 'BOT') {
    res.render('signup', { message: 'This username is already taken!' });
    return;
  }

  //Checks if the username already exists 
  User.find({ username })
  .then(result => {
    if (result && result.length > 0) {
      res.render('signup', { message: 'This username is already taken!' });      
      return;
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(11));
    User.create({ 
      username, 
      password: hash 
    })
    .then(newUser => {
      // req.app.set('user', newUser);
      res.redirect(307, '/chatroom');
    })
    .catch(e => {
      console.log(e);
      res.render('signup', { message: 'Error creating the user!' });  
    })

  })
  .catch(e => {
    console.log(e);
    res.render('signup', { message: 'Error creating the user!' });
  })
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.render('login', { message: err });
      return;
    }
    
    if (!user) {
      res.render('login', { message: info.message });
      return
    }

    req.login(user, () => {
      res.redirect('/chatroom');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/auth/login');
});

module.exports = router;