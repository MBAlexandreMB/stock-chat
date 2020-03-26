const amqp = require('amqplib/callback_api');

module.exports = class BotListener {
  constructor(amqpAdress, rooms, socket) {
    this.amqpAdress = amqpAdress;
    this.rooms = rooms;
    this.socket = socket;
    this.channel;
    this.connect(this.rooms)
    .then(channel => {
      this.channel = channel;
      this.setListener();
    });    
  }

  // connects to the RabbitMQ server and join the requested rooms
  connect(rooms) {
    return new Promise((resolve, reject) => {
      amqp.connect(this.amqpAdress, function(error, connection) {
        if (error) {
          reject(error);
        }
        connection.createChannel(function(error, channel) {
          rooms.forEach(room => {
            channel.assertQueue(room, { durable: false });
          });

          resolve(channel);
        });
      });
    }); 
  }

  messageToBot(data) {
    this.channel.sendToQueue(
      'messageFromServer',
      Buffer.from(JSON.stringify(data))
    );
  }

  setListener() {
    // to keep socket context
    const socket = this.socket;
    this.channel.consume(this.rooms[0], function(data) {
    // parses data from a buffer to an object
    data = JSON.parse(data.content.toString());
      if (socket) {
        socket.messageToRoom(data.room, data.message, 'BOT', !data.error);
      }
    });
  }
}