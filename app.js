require('dotenv').config();

const express = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs          = require('hbs');
const mongoose     = require('mongoose');

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io');

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/index'));

server.listen(3000);