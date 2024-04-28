import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import { env } from './configs/index.js';
import ServerConfiguration from './serverConf.js';

import { viewsRouter, apiRouter } from './routers/index.js';
import {
  errorMiddleware,
  socketMiddleware,
  guardRoute,
} from './middlewares/index.js';

// INITIALIZES SERVER
const server = express();

// CONFIGURATIONS
const configuration = new ServerConfiguration(server);
configuration.setupMiddlewares();
configuration.setupTemplateEngines();

// SERVERS: HTTP AND WEBSOCKET
const { PORT } = env;
const httpServer = server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
const socketServer = new Server(httpServer);

// SET UP MONGOOSE
const { DB_HOST, DB_PORT, DB_NAME } = env;
mongoose.connect(`${DB_HOST}:${DB_PORT}/${DB_NAME}`);
mongoose.connection.on('open', () =>
  console.log(
    `Connected successfully to ${DB_NAME} db on URL ${DB_HOST}:${DB_PORT}`,
  ),
);
mongoose.connection.on('error', () =>
  console.log('Failed to connect to database'),
);

// ROUTERS
server.use('/', viewsRouter);
server.use('/api/v1', socketMiddleware(socketServer), apiRouter);

// ERROR HANDLING MIDDLEWARES
server.use(guardRoute);
// must be after all the other .use() calls
server.use(errorMiddleware);
