import path from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';

import { viewsRouter, apiRouter } from './routers/index.js';
import { socketMiddleware } from './utils/index.js';

// Initializing Express app
const server = express();

// Middleware that allows Express to interpret JSON requests
server.use(express.json());

// Middleware to serve static files
server.use(express.static(`${path.resolve()}/src/public`));

// Configuring handlebars templating engine
server.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
  }),
);
server.set('views', `${path.resolve()}/src/views`);
server.set('view engine', 'hbs');

const PORT = process.env.PORT || 8080;
const httpServer = server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
const socketServer = new Server(httpServer);

// Adding routers
server.use('/', viewsRouter);
server.use('/api/v1', socketMiddleware(socketServer), apiRouter);

// Hooks for websocket
socketServer.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('Cliente conectado');

  // Receives message from client
  socket.on('message', (data) => console.log(data));

  // Sends message to the client when it connects
  socket.emit('message_to_client', 'I send this message unto you');

  // Sends message to all the other clients
  socket.broadcast.emit(
    'message_to_other_clients',
    'I send this message unto the other clients',
  );

  // Sends message to ALL clients
  socketServer.emit('message_to_all_clients', 'I send this general broadcast');
});

// Middleware for error handling
// eslint-disable-next-line no-unused-vars
server.use((error, req, res, next) => {
  res.status(error.statusCode || 500).send({
    status: 'error',
    message: error.message || 'Something broke!',
  });
});
