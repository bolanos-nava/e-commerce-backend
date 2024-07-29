import { Server } from 'socket.io';

import { env } from './configs/index.js';
import ServerConfiguration from './serverConf.js';

import { viewsRouter, apiRouter, testRouter } from './routers/index.js';
import {
  errorMiddleware,
  socketMiddleware,
  guardRoute,
} from './middlewares/index.js';

async function start() {
  /* --------- CONFIGURATIONS ---------- */
  const configuration = ServerConfiguration.instance;
  const logger = configuration.setupLogger();
  configuration.setupDb();
  configuration.setupMiddlewares();
  configuration.setupTemplateEngines();

  /* --------- SERVERS: HTTP AND WEBSOCKET ---------- */
  const { SERVER_PORT } = env;
  const { server } = configuration;
  const httpServer = server.listen(SERVER_PORT, () => {
    logger.info(`Server listening on port ${SERVER_PORT}`);
  });

  const socketServer = new Server(httpServer);

  /* --------- PASSPORT --------- */
  configuration.setupPassport();

  /* --------------- ROUTERS ----------- */
  server.use('/', viewsRouter);
  server.use('/api/v1', socketMiddleware(socketServer), apiRouter);
  server.use('/test', testRouter);

  /* --------- ERROR HANDLING MIDDLEWARES ---------- */
  server.use(guardRoute);
  server.use(errorMiddleware); // must be after all the other .use() calls
}

start();
