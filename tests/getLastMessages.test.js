require('dotenv').config();

const { getLastMessages } = require('../config/utils');
const Message = require('../models/message');
const mongoose = require('mongoose');

beforeAll(async () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

// getLastMessages should be a Promise
test('getLastMessages should return an object', () => {
  expect(typeof getLastMessages('Main', 50)).toBe('object');
});


test('getLastMessages should resolve an array', () => {
  getLastMessages('Main', 50)
  .then(messages => {
    expect(typeof messages).toBe('object');
    expect(typeof messages.length).toBe('number');
  })
});

test('getLastMessages should return X messages or less from Main room', () => {
  const x = 50;
  Message.countDocuments({ room: 'Main' })
  .then(numOfMessages => {
    if (numOfMessages >= x) {
      numOfMessages = x;
    }

    getLastMessages('Main', x)
    .then(messages => {
      expect(messages.length).toBe(numOfMessages);
    });
  });
});
