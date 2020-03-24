const mongoose = require('mongoose');

const Room = new mongoose.model(
  'rooms', 
  new mongoose.Schema({
    name: String,
  }, {
    timestamps: true,
  })
);

module.exports = Room;