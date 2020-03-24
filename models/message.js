const mongoose = require('mongoose');

const Message = new mongoose.model(
  'messages', 
  new mongoose.Schema({
    author: String,
    message: String,
    room: String,
    postDate: Date,
    shownDate: String,
  })
);

module.exports = Message;