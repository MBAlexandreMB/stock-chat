const mongoose = require('mongoose');

const User = new mongoose.model(
  'users', 
  new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
  }, {
    timestamps: true,
  })
);

module.exports = User;