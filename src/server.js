/* eslint-disable no-console */
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import { env } from './configs/index.js';
import ServerConfiguration from './serverConf.js';

import { viewsRouter, apiRouter } from './routers/index.js';
import {
  errorMiddleware,
  socketMiddleware,
  guardRoute,
} from './middlewares/index.js';
import testSessionsRouter from './testSessionsRouter.js';

async function start() {
  /* --------- CONFIGURATIONS ---------- */
  const configuration = new ServerConfiguration();
  await configuration.setupDb();
  configuration.setupMiddlewares();
  configuration.setupTemplateEngines();

  /* --------- SERVERS: HTTP AND WEBSOCKET ---------- */
  const { PORT } = env;
  const { server } = configuration;
  const httpServer = server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
  const socketServer = new Server(httpServer);

  /* --------- TESTING SESSIONS --------- */
  server.use(
    expressSession({
      secret: 'password',
      resave: true,
      saveUninitialized: true,
    }),
  );
  server.use(cookieParser('password'));
  server.use('/test', testSessionsRouter);

  /* --------------- ROUTERS ----------- */
  server.use('/', viewsRouter);
  server.use('/api/v1', socketMiddleware(socketServer), apiRouter);

  /* --------- ERROR HANDLING MIDDLEWARES ---------- */
  server.use(guardRoute);
  server.use(errorMiddleware); // must be after all the other .use() calls
}

start();
