class HTMLHandler {
  constructor (newRoomInput, messageInput, messageContainer, roomContainer) {
    this.messageInput = messageInput;
    this.newRoomInput = newRoomInput;
    this.shouldScroll = true;

    this.messageContainer = messageContainer;
    this.roomContainer = roomContainer;
  }
  
  showMessage = (user, message, date) => {
    this.checkForMessagesToRemove();
    // creates the container div for the message item
    const div = document.createElement('div');
    div.classList.add('message-item');

    // creates the message and format (user: message)
    const msgParagraph = document.createElement('p');
    msgParagraph.innerHTML = `<b>${user}:</b> ${message}`;
    div.appendChild(msgParagraph);
    
    // if the message comes with a date, sets it too
    if (date) {
      const dateParagraph = document.createElement('p');
      dateParagraph.innerHTML = date;
      div.appendChild(dateParagraph);
    }

    // append the div to the container
    this.messageContainer.appendChild(div);

    // scroll the screen down
    if (this.shouldScroll) {
      div.scrollIntoView();
    }
  }

  checkForMessagesToRemove() {
    const messageList = document.getElementsByClassName('message-item');
    if (messageList.length >= 50) {
      this.messageContainer.removeChild(messageList[0]);
    }
  }

  messageSubmited() {
    this.messageInputValue = '';
    this.messageInput.focus();
  }

  newRoomSubmited() {
    this.newRoomInputValue = '';
    this.newRoomInput.focus();
  }

  clearMessages() {
    this.messageContainer.innerHTML = '';
  }

  showRoom(roomName, onChangeRoom) {
    const li = document.createElement('li');
    li.innerHTML = roomName;
    li.onclick = onChangeRoom(roomName);

    this.roomContainer.appendChild(li);
  }

  showErrorRoom(error) {
    alert(error);
  }

  roomChanged(roomName) {
    document.getElementById('current-room-name').innerHTML = roomName;
  }

  get newRoomInputValue() {
    return this.newRoomInput.value;
  }

  set newRoomInputValue(value) {
    this.newRoomInput.value = value;
  }

  get messageInputValue() {
    return this.messageInput.value;
  }

  set messageInputValue(value) {
    this.messageInput.value = value;
  }

  set scrollWithMessages(value) {
    if (typeof value === 'boolean') {
      this.shouldScroll = value;
    }
  }
}