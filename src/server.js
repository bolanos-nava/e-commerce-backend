import './commander.js';
import { env } from './configs/index.js';
import ServerConfiguration from './ServerConfiguration.js';

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
  configuration.setupMailing();

  /* --------- SERVERS: HTTP AND WEBSOCKET ---------- */
  const { SERVER_PORT, USE_BUILT_IN_WS } = env;
  const { server } = configuration;
  const httpServer = server.listen(SERVER_PORT, () => {
    logger.info(`Server listening on port ${SERVER_PORT}`);
  });

  let socketServer;
  if (USE_BUILT_IN_WS) {
    logger.info('Using built-in websocket server');
    const { Server } = await import('socket.io');
    socketServer = new Server(httpServer);
    socketServer.on('connection', (socket) =>
      logger.debug(`Socket connected: ${socket.id}`),
    );
  }

  /* --------- PASSPORT --------- */
  configuration.setupPassport();

  /* --------------- ROUTERS ----------- */
  server.use('/', viewsRouter);
  if (socketServer) {
    server.use('/api/v1', socketMiddleware(socketServer), apiRouter);
  } else server.use('/api/v1', apiRouter);
  server.use('/test', testRouter);

  /* --------- ERROR HANDLING MIDDLEWARES ---------- */
  server.use(guardRoute);
  server.use(errorMiddleware); // must be after all the other .use() calls
}

start();
