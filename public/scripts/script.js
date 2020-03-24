const messageInput = document.getElementById('message-input');
const submitBtn = document.getElementById('message-btn');
const messagesContainer = document.getElementById('messages-container');
const username = document.getElementById('username').value;
const checkbox = document.getElementById('scroll-checkbox');

const newRoomInput = document.getElementById('newroom-input');
const newRoomBtn = document.getElementById('newroom-btn');
const roomsContainer = document.getElementById('rooms-container-ul');

const handler = new HTMLHandler(newRoomInput, messageInput, messagesContainer, roomsContainer);
const socket = new Socket(io, handler, username);

newRoomBtn.addEventListener('click', (event) => {
  event.preventDefault();
  socket.onAddNewRoom();
});

submitBtn.addEventListener('click', (event) => {
  event.preventDefault();
  socket.onMessageSubmit();
});

messageInput.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    event.preventDefault();
    socket.onMessageSubmit();
  }
});

newRoomInput.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    event.preventDefault();
    socket.onAddNewRoom();
  }
});

checkbox.addEventListener('change', () => {
  handler.scrollWithMessages = checkbox.checked;
});
