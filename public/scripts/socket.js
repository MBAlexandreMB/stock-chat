class Socket {
  constructor(ioServer, HTMLHandler, username) {
    this.socket = ioServer(window.location.origin);
    this.setSocketListeners();
    this.username = username;

    this.HTMLHandler = HTMLHandler;
  }

  setSocketListeners() {
    this.socket.on('logged', () => {
      this.socket.emit('username', this.username);
    });

    this.socket.on('messageFromServer', (data) => {
      console.log(data);
      this.HTMLHandler.showMessage(data.text);
    });
  }

  onMessageSubmit() {
    this.socket.emit('clientMessage', { message: this.HTMLHandler.inputValue });
    this.HTMLHandler.messageSubmited();
  }
}

