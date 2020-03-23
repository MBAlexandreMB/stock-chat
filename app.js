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
  const room = 'r1'
  socket.join(room);
  io.to(room).emit('messageFromServer', { text: `Connection stablished to room ${room}` });

  socket.on('clientMessage', (data) => {
    io.to(room).emit('messageFromServer', { text: data.message });
  });
});

app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/main'));

server.listen(3000);