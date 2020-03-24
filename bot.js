// const app          = require('express')();
const http         = require('http');
const server       = http.createServer();
const io           = require('socket.io-client');
const axios        = require('axios');

  const socket = io('http://localhost:3000');
  socket.on('connect', () => {
    socket.emit('username', 'BOT');
    socket.emit('getBotRooms');
  });

  socket.on('getNewRooms', () => {
    socket.emit('getBotRooms');
  });

  socket.on('messageFromServer', (data) => {
    if (data.text.trim().toLowerCase().substr(0, 7) === '/stock=') {
      const stock = data.text.split('=')[1].toUpperCase();
      axios.get(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`)
      .then(result => {
        let closeValue = result.data.split(stock)[1].split(',');
        closeValue = closeValue[closeValue.length - 2];
        
        const error = checkForErrors(stock, closeValue);
        if (!error) {
          socket.emit('botMessage', { room: data.room, message: `${stock} quote is $${closeValue} per share.`});
        } else {
          socket.emit('botMessage', { room: data.room, message: error });
        }
      })
      .catch(e => console.log(e));
    }
  });

  const checkForErrors = (stock, closeValue) => {
    let response = '';
    
    if (stock === '' || stock === undefined) {
      return 'Please, type a stock code after "/stock="';
    }

    if (closeValue === 'N/D') {
      response += `No data for stock ${stock}.`;
    }

    if (stock[0] === '"' || stock[0] === "'") {
      response += ` Try /stock=${stock.replace(/[\"\']/g, '')} (without quotes).`;
    }

    return response;
  }

server.listen(4000);