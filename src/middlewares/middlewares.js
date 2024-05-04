import { ZodError } from 'zod';
import { ResourceNotFoundError } from '../customErrors/index.js';

/**
 * @typedef {import('../types').ExpressType} ExpressType
 * @typedef {import('../types').WSServer} WSServer
 */

/**
 * Middleware to catch all errors
 * @type {ExpressType['ErrorRequestHandler']}
 */
export function errorMiddleware(error, req, res, next) {
  let { message } = error;
  if (error.type === 'json') {
    message = JSON.parse(error.message);
  } else if (error instanceof ZodError) {
    message = error.issues.map(({ message: zodMessage }) => zodMessage);
  }
  // eslint-disable-next-line no-console
  console.error(error.stack);
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: message || 'Internal server error',
  });
}

/**
 * Makes the websocket server instance available in the request object
 * @param {WSServer} socketServer Websocket server
 * @returns {ExpressType['RequestHandlerWS']} Middleware handler function to add the websocket server instance to the request object
 */
export function socketMiddleware(socketServer) {
  return (req, res, next) => {
    req.socketServer = socketServer;
    next();
  };
}

/**
 * Handler for undefined routes
 * @type {ExpressType['RequestHandler']}
 */
export function guardRoute(req, res, next) {
  const error = new ResourceNotFoundError(`Route ${req.url} not found`);
  error.statusCode = 404;
  throw error;
}
