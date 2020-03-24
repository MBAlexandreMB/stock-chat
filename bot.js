const app          = require('express')();
const http         = require('http');
const server       = http.createServer();
const io           = require('socket.io-client');
const axios        = require('axios');

  const socket = io('http://localhost:3000');
  socket.on('connect', () => {
    socket.emit('botMessage', { message: 'I\'m in!' });
  });

  socket.on('messageFromServer', (data) => {
    if (data.text.substr(0, 7) === '/stock=') {
      const stock = data.text.split('=')[1].toUpperCase();
      axios.get(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`)
      .then(result => {
        let closeValue = result.data.split(stock)[1].split(',');
        closeValue = closeValue[closeValue.length - 2];
        socket.emit('botMessage', { message: `${stock} quote is $${closeValue} per share.`});
      })
      .catch(e => console.log(e));
    }
  });

server.listen(4000);