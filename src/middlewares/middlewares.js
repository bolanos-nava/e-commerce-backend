/**
 * @typedef {import('../types').Express} Express
 * @typedef {import('../types').WSServer} WSServer
 */

import { ResourceNotFoundError } from '../customErrors/index.js';

/** Middleware to catch all errors
 * @type {Express['ErrorRequestHandler']}
 */
export function errorMiddleware(error, req, res, next) {
  let { message } = error;
  if (error.type === 'json') {
    message = JSON.parse(error.message);
  }
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: message || 'Something broke!',
  });
}

/**
 * Makes the websocket server instance available in the request object
 * @param {WSServer} socketServer Websocket server
 * @returns {Express['RequestHandlerWS']} Middleware handler function to add the websocket server instance to the request object
 */
export function socketMiddleware(socketServer) {
  return (req, res, next) => {
    req.socketServer = socketServer;
    next();
  };
}

/** Handler for undefined routes
 * @type {Express['RequestHandler']}
 */
export function guardRoute(req, res, next) {
  const error = new ResourceNotFoundError(`Route ${req.url} not found`);
  error.statusCode = 404;
  throw error;
}
