const Message = require('../models/message');

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

const getLastMessages = (room) => {
  return new Promise((resolve, reject) => {
    Message.countDocuments()
    .then(count => {
      if (count > 50) {
        Message.find({ room }).sort({ postDate: 1}).skip(count - 50)
        .then(result => {
          resolve(result);
        })
        .catch(e => {
          reject(e);
        });
      } else {
        Message.find({ room }).sort({ postDate: 1})
        .then(result => {
          resolve(result);
        })
        .catch(e => {
          reject(e);
        });
      }
    });
  });
};

const saveMessage = (message, author, room, postDate, shownDate) => {
  if (message.trim().substr(0, 7) !== '/stock=') {
    Message.create({
      author,
      message,
      room,
      postDate,
      shownDate
    });
  }
};

module.exports = { ensureLoggedIn, ensureLoggedOut, getLastMessages, saveMessage };