class Socket {
  constructor(ioServer, HTMLHandler, username) {
    this.socket = ioServer(window.location.origin);
    this.setSocketListeners();
    this.username = username;

    this.HTMLHandler = HTMLHandler;
  }

  setSocketListeners() {
    // identifies itself upon connection
    this.socket.on('connect', () => {
      this.socket.emit('username', this.username);
    });
    
    // clear the current messages and loads all recorded messages from current room
    this.socket.on('recordedMessages', (recordedMessages) => {
      this.HTMLHandler.clearMessages();
      recordedMessages.forEach(data => {
        this.HTMLHandler.showMessage(data.author, data.message, data.shownDate);
      });
    });

    // shows up new messages on the screen
    this.socket.on('messageFromServer', (data) => {
      this.HTMLHandler.showMessage(data.user, data.text, data.date);
    });

    // shows up new rooms on the screen
    this.socket.on('newRoomFromServer', (data) => {
      this.HTMLHandler.showRoom(data.room, this.onChangeRoom.bind(this));
    });
    
    // when trying to create a room with an existing name, refuses it
    this.socket.on('roomAlreadyExists', (data) => {
      this.HTMLHandler.showErrorRoom(data.message);
    });
  }

  onMessageSubmit() {
    this.socket.emit('clientMessage', { 
      username: this.username, 
      message: this.HTMLHandler.messageInputValue,
    });
    this.HTMLHandler.messageSubmited();
  }

  onAddNewRoom() {
    this.socket.emit('createNewRoom', { roomName: this.HTMLHandler.newRoomInputValue });
    this.HTMLHandler.newRoomSubmited();
  }

  onChangeRoom(roomName) {
    this.socket.emit('changeRoom', { roomName });
    this.HTMLHandler.roomChanged(roomName);
  }
}