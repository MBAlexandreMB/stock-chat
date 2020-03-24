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

    this.socket.on('messageFromServer', (data) => {
      this.HTMLHandler.showMessage(data.user, data.text, data.date);
    });
  }

  onMessageSubmit() {
    this.socket.emit('clientMessage', { username: this.username, message: this.HTMLHandler.inputValue });
    this.HTMLHandler.messageSubmited();
  }
}