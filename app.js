require('dotenv').config();

const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose     = require('mongoose');
const passport     = require('./config/passport');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);
const Bot          = require('./config/rabbit.mq');
const app          = express();
const http         = require('http');
const server       = http.createServer(app);
const io           = require('socket.io')(server);
const ServerSocket = require('./config/serverSocket');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Passport and session setup. Keeps the user logged in even app is closed
app.use(session({
  secret: process.env.SESSION_SECRET,
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

// set socket, botListener and feed one another with their instances
const socket = new ServerSocket(io);
const botListener = new Bot(
  process.env.RABBITMQ_AMPQ,
  ['messageFromBot', 'messageFromServer'],
  socket
);
socket.setBot(botListener);

app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/main'));

server.listen(3000);
