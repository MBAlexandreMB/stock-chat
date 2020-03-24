const Message = require('../models/message');
const Room = require('../models/room');

const ensureLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(null, req.user);
  } else {
    res.redirect('/auth/login');
  }
};

const ensureLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/chatroom');
  } else {
    next(null);
  }
};

const getLastMessages = (room, number) => {
  return new Promise((resolve, reject) => {
    Message.countDocuments()
    .then(count => {
      if (count > number) {
        Message.find({ room }).sort({ postDate: 1}).skip(count - number)
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
    })
  }
};

const saveNewRoom = (name) => {
  const restrictedNames = ['MAIN'];
  return new Promise((resolve, reject) => {
    if (restrictedNames.includes(name.toUpperCase())) {
      reject(`"${name}" is a restricted room name!`);
      return
    }

    Room.find({ name })
    .then(room => {
      if (room.length > 0) {
        reject(`Room ${name} already exists!`);
        return;
      }

      Room.create({ name })
      .then(newRoom => resolve(newRoom))
      .catch(e => reject(e));
    })
    .catch(e => reject(e));
  });
};

module.exports = {
  ensureLoggedIn,
  ensureLoggedOut,
  getLastMessages,
  saveMessage,
  saveNewRoom,
};