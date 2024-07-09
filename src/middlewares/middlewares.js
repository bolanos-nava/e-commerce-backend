import { ZodError } from 'zod';
import passport from 'passport';
import {
  CustomError,
  ResourceNotFoundError,
  UnauthorizedError,
} from '../customErrors/index.js';

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
  } else if (error.name === 'ValidationError') {
    message = Object.entries(error.errors).map(([key, err]) => err.message);
  } else if (error.name === 'MongoServerSelectionError') {
    message = ['Error connecting to database'];
  } else {
    message = [message];
  }

  // eslint-disable-next-line no-console
  console.error(error.stack);
  res.status(error.statusCode || 500).json({
    status: 'error',
    code: error.name || 'Error',
    message: message || 'Internal server error',
  });
}

export function passportStrategyErrorWrapper(strategy, passportOpts = {}) {
  return (req, res, next) =>
    passport.authenticate(
      strategy,
      { session: false, ...(passportOpts || {}) },
      (error, user, info) => {
        if (error) return next(error);
        if (!user) {
          let message = 'Missing credentials';
          if (info.message && typeof info.message === 'string') {
            message = info.message;
          } else if (info.toString() !== '[object Object]') {
            message = info.toString();
          } else if (strategy === 'jwt') message = 'No JWT present';
          return next(new UnauthorizedError(message));
        }
        req.user = user;
        next();
      },
    )(req, res, next);
}

export function authorize(...roles) {
  return [
    passportStrategyErrorWrapper('jwt'),
    (req, _, next) => {
      const { role } = req.user;
      if (roles.includes(role)) return next();

      return next(
        new UnauthorizedError('You are not allowed to perform this action'),
      );
    },
  ];
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
