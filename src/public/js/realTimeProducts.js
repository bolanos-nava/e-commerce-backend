/* eslint-disable no-undef */

const socket = io();

socket.on('new_product', (data) => {
  console.log(data);
});
