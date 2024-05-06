/* eslint-disable no-console */
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

/* --------- EXPRESS INITIALIZATION ---------- */
const server = express();

/* --------- CONFIGURATIONS ---------- */
const configuration = new ServerConfiguration(server);
configuration.setupMiddlewares();
configuration.setupTemplateEngines();

/* --------- SERVERS: HTTP AND WEBSOCKET ---------- */
const { PORT } = env;
const httpServer = server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
const socketServer = new Server(httpServer);

/* --------- MONGODB CONNECTION ---------- */
const { NODE_ENV, DB_URI } = env;
mongoose.connect(DB_URI);
mongoose.connection.on('open', () =>
  console.log(
    `Connected successfully to MongoDB${NODE_ENV === 'dev' ? ` on URI ${DB_URI}` : ' Atlas cluster'}`,
  ),
);
mongoose.connection.on('error', () =>
  console.log('Failed to connect to database'),
);

/* --------- ROUTERS ---------- */
server.use('/', viewsRouter);
server.use('/api/v1', socketMiddleware(socketServer), apiRouter);

/* --------- ERROR HANDLING MIDDLEWARES ---------- */
server.use(guardRoute);
server.use(errorMiddleware); // must be after all the other .use() calls
