class ChatHandler {
  constructor (input, submitButton, container) {
    this.input = input;
    this.submitButton = submitButton;
    this.shouldScroll = true;

    this.container = container;
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
    this.container.appendChild(div);

    // scroll the screen down
    if (this.shouldScroll) {
      div.scrollIntoView();
    }
  }

  checkForMessagesToRemove() {
    const messageList = document.getElementsByClassName('message-item');
    if (messageList.length >= 50) {
      this.container.removeChild(messageList[0]);
    }
  }

  messageSubmited() {
    this.inputValue = '';
    this.input.focus();
  }

  clearMessages() {
    this.container.innerHTML = '';
  }
  
  get inputValue() {
    return this.input.value;
  }

  set inputValue(value) {
    this.input.value = value;
  }

  set scrollWithMessages(value) {
    if (typeof value === 'boolean') {
      this.shouldScroll = value;
    }
  }
}