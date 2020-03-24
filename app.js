require('dotenv').config();

const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const passport     = require('./config/passport');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const app          = express();
const http         = require('http');
const server       = http.createServer(app);
const io           = require('socket.io')(server);
const { 
  getLastMessages, 
  saveMessage, 
  saveNewRoom,
}                  = require('./config/utils');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).
then((result) => {
  const connection = result.connections[0];
  console.log('----- MongoDB Connected -----');
  console.log('Host:', connection.host);
  console.log('Database name:', connection.name);
  console.log('Port:', connection.port);
  console.log('-----------------------------');
})
.catch(e => console.log(e));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Passport and session setup. Keeps the user logged in even app is closed
app.use(session({
  secret: "jobsity-chat-app",
  cookie: { maxAge: 12000000 },
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// Sets SocketIo for every route;
app.use((req, res, next) => {
  res.io = io;
  next();
});

io.on('connection', (socket) => {
  let currentRoom = 'Main';
  // upon connection, joins user in the main room
  socket.join('Main');
  // get last X messages of the room and sent it to the new user in the room
  getLastMessages(currentRoom, 50)
  .then(lastMessages => {
    if (lastMessages) {
      socket.emit('recordedMessages', lastMessages);
    }
  });

  // when a bot comes in, he'll subscribe to every room available with at least 1 user
  socket.on('getBotRooms', () => {
    setBotRooms(socket);
  });

  // upon identification, warns the other users about his entry on the room
  socket.on('username', (username) => {
    socket.to(currentRoom).emit('messageFromServer', { 
      user: 'SYSTEM',
      text: `${username} just entered in the room`,
      date: getDatePattern(new Date(Date.now()))
    });
  });

  // when a user send a message, send the message back to all members in the room
  socket.on('clientMessage', (data) => {
    messageToRoom(currentRoom, data.message, data.username);
  });
  
  // when a bot send a message, send the message back to all members in the room
  socket.on('botMessage', (data) => {
    messageToRoom(data.room, data.message, 'BOT');
  });

  // when a new room is created, the room is saved in the database
  socket.on('createNewRoom', (data) => {
    if (data.roomName) {
      saveNewRoom(data.roomName)
      .then(newRoom => {
        io.emit('newRoomFromServer', { room: newRoom.name });
      })
      .catch(e => {
        socket.emit('roomAlreadyExists', { message: e });
      });
    }
  });

  // if a socket asks to change room, removes it from current room and join him on the new one
  socket.on('changeRoom', (data) => {
    socket.leave(getNonPersonalRooms(socket));
    socket.join(data.roomName);
    getLastMessages(data.roomName, 50)
    .then(lastMessages => {
      if (lastMessages) {
        socket.emit('recordedMessages', lastMessages);
      }
    });

    // wait for the room change to take effect
    setTimeout(() => {
      io.to('bot').emit('getNewRooms');
    }, 1000);
    currentRoom = data.roomName;
  });
});

const messageToRoom = (room, message, user) => {
  if (message) {
    const date = new Date(Date.now());
    const shownDate = getDatePattern(date);
    saveMessage(message, user, room, date, shownDate);
    io.to(room).emit('messageFromServer', {
      user,
      text: message,
      date: shownDate,
      room
    });
  }
}

const setBotRooms = (bot) => {
  bot.leaveAll();
  bot.join('bot');
  for (socket in io.sockets.sockets) {
    if (bot.id !== socket) {
      bot.join(getNonPersonalRooms(io.sockets.sockets[socket]));
    }
  }
};

const getDatePattern = (date) => {
  return `
  ${date.toLocaleDateString()} - 
  ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
  `;
}

const getNonPersonalRooms = (socket) => {
  const rooms = Object.keys(socket.rooms);
  const ownRoomIndex = rooms.indexOf(socket.id);
  rooms.splice(ownRoomIndex, 1);

  return rooms;
}

app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/main'));

server.listen(3000);