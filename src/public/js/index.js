/* eslint-disable no-undef */

const socket = io();
let user;
// Swal.fire({
//   title: 'Hola coders',
//   text: 'Alerta básica con SweetAlert2',
//   icon: 'success',
// });

Swal.fire({
  title: 'Identifícate!!!',
  input: 'text',
  text: 'Ingresa el usuario para identificarte en el chat',
  inputValidator: (value) => {
    return !value && 'Necesitas escribir un nombre de usuario para continuar';
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  console.log(user);
});

const chatbox = document.getElementById('chatbox');
chatbox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatbox.value.trim().length) {
      socket.emit('chatMessage', {
        user,
        message: chatbox.value.trim(),
      });
      chatbox.value = '';
    }
  }
});

socket.on('messageLogs', (data) => {
  const messageLogs = document.getElementById('messageLogs');

  let messages = '';
  data.forEach((message) => {
    messages += `<li>${message.user} dice - ${message.message}`;
  });
  messageLogs.innerHTML = messages;
});
