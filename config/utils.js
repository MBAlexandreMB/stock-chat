const Message = require('../models/message');
const Room = require('../models/room');

// for routes that needs login to access
const ensureLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(null, req.user);
  } else {
    res.redirect('/auth/login');
  }
};

// for routes that needs to be NOT logged in to access
const ensureLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/chatroom');
  } else {
    next(null);
  }
};

// checks for the last X recorded messages in a room
const getLastMessages = (room, number) => {
  let skip = 0;
  return new Promise((resolve, reject) => {
    Message.countDocuments({ room })
    .then(count => {
      if (count > number) {
        skip = count - number;
      }

      Message.find({ room }).sort({ postDate: 1}).skip(skip)
      .then(result => {
        resolve(result);
      })
      .catch(e => {
        reject(e);
      });
    });
  });
};

// save messages if not a command
const saveMessage = (message, author, room, postDate, shownDate) => {
  if (message.trim().toLowerCase().substr(0, 7) !== '/stock=') {
    Message.create({
      author,
      message,
      room,
      postDate,
      shownDate
    })
  }
};

// save new room if the name is unique and not in the restriction list
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