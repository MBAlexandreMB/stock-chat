const messageInput = document.getElementById('message-input');
const submitBtn = document.getElementById('message-btn');
const messagesContainer = document.getElementById('messages-container');
const username = document.getElementById('username').value;
const checkbox = document.getElementById('scroll-checkbox');

const handler = new ChatHandler(messageInput, submitBtn, messagesContainer);
const socket = new Socket(io, handler, username);

submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  socket.onMessageSubmit();
});

window.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    socket.onMessageSubmit();
  }
});

checkbox.addEventListener('change', () => {
  handler.scrollWithMessages = checkbox.checked;
});
