/* eslint-disable no-undef */
const socket = io();

function addMessageToFrontend(data) {
  const messagesList = document.getElementById('messagesList');
  const message = document
    .getElementById('messageTemplate')
    .content.cloneNode(true);

  const messageUser = message.querySelector('.message__user');
  messageUser.innerText = `${data.user} dice:`;

  const messageText = message.querySelector('.message__text');
  messageText.innerText = `"${data.message}"`;

  messagesList.appendChild(message);

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
}

const chatForm = document.getElementById('chatForm');
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // extracts data from form
  const message = Object.fromEntries(new FormData(chatForm));

  try {
    const response = await fetch('/api/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const jsonResponse = await response.json();
    if (!response.ok) throw Error(jsonResponse.message);
    console.log(jsonResponse);
  } catch (error) {
    console.error(error);
  }
});

socket.on('new_message', (data) => {
  addMessageToFrontend(data);
});
