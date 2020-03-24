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

// Setup ------------------
let messages = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

messages = messages.map(message => {
  return {
    author: 'test',
    message: `${message}`,
    room: 'test',
    postDate: new Date(Date.now()),
    shownDate: '01/01/2020 - 00:00',
  }
});
// ------------- end setup ---------------

test('getLastMessages should have the message "25", but not "1"', () => {
Message.create(messages)
.then(result => {
    getLastMessages('Main', x)
    .then(messages => {
      messages = messages.map(el => el.message);
      expect(messages).toContain('25');
      expect(messages).not.toContain('1');
    });
  });
});

// ------------ Post test --------------
afterEach(async () => {
  await Message.deleteMany({room: 'test'})
})
// ------------ end post test --------------

