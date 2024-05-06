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

const { env } = window;
const chatForm = document.getElementById('chatForm');
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // extracts data from form
  const messageData = new FormData(chatForm);

  // constructs new object from the form data
  const newMessage = {};
  messageData.entries().forEach(([key, value]) => {
    newMessage[key] = value;
  });

  try {
    const response = await fetch(`${env.API_URL}:${env.PORT}/api/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: newMessage }),
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
