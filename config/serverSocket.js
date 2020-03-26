const { saveMessage, saveNewRoom, getLastMessages } = require('./utils');

module.exports = class serverSocket {
  constructor(ioServer) {
    this.io = ioServer;
    this.setListeners();
    this.bot;
  }

  setListeners() {
    this.io.on('connection', (socket) => {    
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
    
      // upon identification, warns the other users about his entry on the room
      socket.on('username', (username) => {
        socket.to(currentRoom).emit('messageFromServer', { 
          user: 'SYSTEM',
          text: `${username} just entered in the room`,
          date: this.getDatePattern(new Date(Date.now()))
        });
      });
    
      // when a user send a message, send the message back to all members in the room
      socket.on('clientMessage', (data) => {
        if (this.bot) {
          this.bot.messageToBot({room: currentRoom, message: data.message});
        }
        this.messageToRoom(currentRoom, data.message, data.username, true);
      });
      
      // when a new room is created, the room is saved in the database
      socket.on('createNewRoom', (data) => {
        if (data.roomName) {
          saveNewRoom(data.roomName)
          .then(newRoom => {
            this.io.emit('newRoomFromServer', { room: newRoom.name });
          })
          .catch(e => {
            socket.emit('roomAlreadyExists', { message: e });
          });
        }
      });
    
      // if a socket asks to change room, removes it from current room and join him on the new one
      socket.on('changeRoom', (data) => {
        socket.leave(this.getNonPersonalRooms(socket));
        socket.join(data.roomName);
        currentRoom = data.roomName;
        getLastMessages(data.roomName, 50)
        .then(lastMessages => {
          if (lastMessages) {
            socket.emit('recordedMessages', lastMessages);
          }
        });
      });
    });
  }

  messageToRoom(room, message, user, save) {
    if (message) {
      const date = new Date(Date.now());
      const shownDate = this.getDatePattern(date);
      
      this.io.to(room).emit('messageFromServer', {
        user,
        text: message,
        date: shownDate,
        room
      });

      // error messages shouldn't be saved, so we check if we should save it
      if (save) {
        saveMessage(message, user, room, date, shownDate);
      }
    }
  }

  // returns a showable date (MM/DD/YYYY - hh:mm)
  getDatePattern(date) {
    return `${date.toLocaleDateString()} - ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // as every person has its own room, when changing a room, we should keep it
  getNonPersonalRooms(socket) {
    const rooms = Object.keys(socket.rooms);
    const ownRoomIndex = rooms.indexOf(socket.id);
    rooms.splice(ownRoomIndex, 1);

    return rooms;
  }

  // if there's a bot, socket should know it to notify when new messages are on
  setBot(bot) {
    this.bot = bot;
  }
}