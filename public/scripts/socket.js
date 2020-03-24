class Socket {
  constructor(ioServer, HTMLHandler, username) {
    this.socket = ioServer(window.location.origin);
    this.setSocketListeners();
    this.username = username;

    this.HTMLHandler = HTMLHandler;
  }

  setSocketListeners() {
    this.socket.on('connect', () => {
      this.socket.emit('username', this.username);
    });

    this.socket.on('recordedMessages', (recordedMessages) => {
      this.HTMLHandler.clearMessages();
      recordedMessages.forEach(data => {
        this.HTMLHandler.showMessage(data.author, data.message, data.shownDate);
      });
    });

    this.socket.on('messageFromServer', (data) => {
      this.HTMLHandler.showMessage(data.user, data.text, data.date);
    });

    this.socket.on('newRoomFromServer', (data) => {
      this.HTMLHandler.showRoom(data.room, this.onChangeRoom.bind(this));
    });
    
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