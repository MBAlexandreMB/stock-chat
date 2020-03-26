require('dotenv').config();

const amqp = require('amqplib/callback_api');
const axios = require('axios');

// connects to amqp rabbitMQ server
amqp.connect(process.env.RABBITMQ_AMPQ, function(error, connection) {
  if (error) {
    throw error;
  }
  connection.createChannel(function(error, channel) {
    if (error) {
      throw error;
    }
  
    channel.assertQueue('messageFromServer', { durable: false });
    channel.assertQueue('messageFromBot', { durable: false });

    // listens any message from server
    channel.consume('messageFromServer', function(data) {
      // transform the buffer in a object
      data = JSON.parse(data.content.toString());

      // checks for commands 
      if (data.message.trim().toLowerCase().substr(0, 7) === '/stock=') {
        // gets the stock from command
        const stock = data.message.split('=')[1].toUpperCase();
        // asks for API information
        axios.get(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`)
        .then(result => {
          // get the close value from CSV response
          let closeValue = result.data.split(stock)[1].split(',');
          closeValue = closeValue[closeValue.length - 2];
          
          // check if the closeValue is an acceptable response
          const error = checkForErrors(stock, closeValue);
          // sets up the response
          const response = {
            room: data.room,
            message: error,
            error: true,
          }
          if (!error) {
              // change the message if there is no error
              response.message = `${stock} quote is $${closeValue} per share.`;
              response.error = false;
            // buffer the message and sends it back
            channel.sendToQueue(
              'messageFromBot', 
              Buffer.from(JSON.stringify(response)), 
              { persistent: false, expiration: '5000' }
            );
          } else {
            // buffer the message and sends it back
            channel.sendToQueue(
              'messageFromBot',
              Buffer.from(JSON.stringify(response)),
              { persistent: false, expiration: '5000' });
          }
        })
        .catch(e => console.log(e));
      }
    }, {
        noAck: true
    });
  })
});

const checkForErrors = (stock, closeValue) => {
  if (!stock) {
    return 'Please, type a stock code after "/stock="';
  }
  let response = '';
  
  if (closeValue === 'N/D') {
    response += `No data for stock ${stock}.`;
  }

  if (stock[0] === "'" || stock[0] === '"') {
    response += ` Try typing /stock=${stock.replace(/[\"\']/g, '')}`;
  }

  return response;
};