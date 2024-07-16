import { Server } from 'socket.io';

import { env } from './configs/index.js';
import ServerConfiguration from './serverConf.js';

import { viewsRouter, apiRouter } from './routers/index.js';
import {
  errorMiddleware,
  socketMiddleware,
  guardRoute,
} from './middlewares/index.js';

async function start() {
  /* --------- CONFIGURATIONS ---------- */
  const configuration = ServerConfiguration.instance;
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

  /* --------- PASSPORT --------- */
  configuration.setupPassport();

  /* --------------- ROUTERS ----------- */
  server.use('/', viewsRouter);
  server.use('/api/v1', socketMiddleware(socketServer), apiRouter);

  /* --------- ERROR HANDLING MIDDLEWARES ---------- */
  server.use(guardRoute);
  server.use(errorMiddleware); // must be after all the other .use() calls
}

start();
