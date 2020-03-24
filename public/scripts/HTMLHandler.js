class ChatHandler {
  constructor (input, submitButton, container) {
    this.input = input;
    this.submitButton = submitButton;

    this.container = container;
  }

  showMessage = (user, message, date) => {
    const div = document.createElement('div');
    div.classList.add('message-item');
    const msgParagraph = document.createElement('p');
    msgParagraph.innerHTML = `<b>${user}:</b> ${message}`;
    div.appendChild(msgParagraph);
    
    if (date) {
      const dateParagraph = document.createElement('p');
      dateParagraph.innerHTML = date;
      div.appendChild(dateParagraph);
    }
    this.container.appendChild(div);
  }

  messageSubmited() {
    this.inputValue = '';
  }
  
  get inputValue() {
    return this.input.value;
  }

  set inputValue(value) {
    this.input.value = value;
  }
}