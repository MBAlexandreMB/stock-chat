const messageInput = document.getElementById('message-input');
const submitBtn = document.getElementById('message-btn');
const messagesContainer = document.getElementById('messages-container');
const username = document.getElementById('username').value;

const handler = new ChatHandler(messageInput, submitBtn, messagesContainer);
const socket = new Socket(io, handler, username);

submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  socket.onMessageSubmit();
});