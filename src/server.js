import express from 'express';
import { Server } from 'socket.io';

import { env } from './configs/index.js';
import ServerConfiguration from './serverConf.js';

import { viewsRouter, apiRouter } from './routers/index.js';
import { errorMiddleware, socketMiddleware } from './middlewares/index.js';

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

// ROUTERS
server.use('/', viewsRouter);
server.use('/api/v1', socketMiddleware(socketServer), apiRouter);

// ERROR HANDLING MIDDLEWARE
// must be after all the other .use() calls
server.use(errorMiddleware);
