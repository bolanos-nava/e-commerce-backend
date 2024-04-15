console.log('Bienvenido al chat');

const socket = io();
socket.emit(
  'message',
  `This is the amount of memory of my heap: ${window.performance.memory.totalJSHeapSize}`,
);
socket.on('message_to_client', (data) => console.log({ data }));
socket.on('message_to_all_clients', (data) => console.log({ data }));
