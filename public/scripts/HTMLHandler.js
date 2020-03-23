class ChatHandler {
  constructor (input, submitButton, container) {
    this.input = input;
    this.submitButton = submitButton;

    this.container = container;
  }

  showMessage = (message) => {
    const p = document.createElement('p');
    p.innerHTML = message;
    this.container.appendChild(p); 
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