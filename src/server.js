import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { productsRouter, cartsRouter } from './routers/index.js';

// Initializing Express app
const server = express();

// Middleware that allows Express to interpret JSON requests
server.use(express.json());

// Middleware to serve static files
server.use(express.static(`${import.meta.dirname}/public`));

// Configuring handlebars templating engine
server.engine('handlebars', handlebars.engine());
server.set('views', `${import.meta.dirname}/views`);
server.set('view engine', 'handlebars');

// Rendering the index view
server.get('/', (req, res) => {
  // First argument is the name of the view
  // Second argument has the variables to substitute in the layouts
  res.render('index', {
    name: 'Adrian',
    title: 'Fuck you very very much',
    permission: false,
    // products: [{ title: 'Shit' }, { title: 'Hell' }],
    products: ['shit', 'hell'],
  });
});

server.get('/chat', (req, res) => {
  res.render('chat');
});

// Adding products router
server.use('/api/v1/products', productsRouter);
server.use('/api/v1/carts', cartsRouter);

const PORT = 8080;
const httpServer = server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
const socketServer = new Server(httpServer);

// Hooks for websocket
socketServer.on('connection', (socket) => {
  console.log('NUEVO CLIENTEEEE CONCHETUMADRE');

  // Receives message from client
  socket.on('message', (data) => console.log(data));

  // Sends message to the client when it connects
  socket.emit('message_to_client', 'I send this message unto you');

  // Sends message to all the clients except the one that connected
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
