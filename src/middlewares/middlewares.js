import { ZodError } from 'zod';
import passport from 'passport';
import {
  ForbiddenError,
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
export function errorMiddleware(error, req, res, __) {
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
  req.logger.error({
    message,
    code: error.name,
    stack: error.stack,
  });
  res.status(error.statusCode || 500).json({
    status: 'error',
    code: error.name || 'Error',
    message: message || ['Internal server error'],
  });
}

export function logHttp(message) {
  return (req, _, next) => {
    req.requestLogger.http(message);
    next();
  };
}

export function passportStrategyErrorWrapper(strategy, passportOpts = {}) {
  return (req, res, next) => {
    if (req.isAnonymous) return next();
    return passport.authenticate(
      strategy,
      { session: false, ...(passportOpts || {}) },
      (error, sessionData, info) => {
        console.error(error, sessionData, info);
        if (error) return next(error);
        if (!sessionData && !info && !error)
          return next(new ResourceNotFoundError("Email doesn't exist"));
        if (!sessionData) {
          let message = 'Missing credentials';
          if (info.message && typeof info.message === 'string') {
            message = info.message;
          } else if (info.toString() !== '[object Object]') {
            message = info.toString();
          } else if (strategy === 'jwt') message = 'No JWT present';
          return next(new UnauthorizedError(message));
        }
        req.user = sessionData;
        next();
      },
    )(req, res, next);
  };
}

export function authorize(...roles) {
  return [
    (req, _, next) => {
      if (!req?.cookies?.token && roles.includes('anon'))
        req.isAnonymous = true;
      next();
    },
    passportStrategyErrorWrapper('jwt'),
    (req, _, next) => {
      if (req.isAnonymous) return next();

      const { role } = req.user;
      if (roles.includes(role)) return next();
      return next(
        new ForbiddenError('You are not allowed to perform this action'),
      );
    },
  ];
  // return (req, res, next) => {
  //   if (!req?.user?.cookies && roles.includes('anon')) return next();

  //   // the next() function should be empty so it doesn't trigger
  //   passportStrategyErrorWrapper('jwt')(req, res, () => {});
  //   const { role } = req.user;
  //   if (roles.includes(role)) return next();
  //   return next(
  //     new ForbiddenError('You are not allowed to perform this action'),
  //   );
  // };
}

/**
 * Makes the websocket server instance available in the request object
 * @param {WSServer} socketServer Websocket server
 * @returns {ExpressType['RequestHandlerWS']} Middleware handler function to add the websocket server instance to the request object
 */
export function socketMiddleware(socketServer) {
  return (req, _, next) => {
    req.socketServer = socketServer;
    next();
  };
}

/**
 * Handler for undefined routes
 * @type {ExpressType['RequestHandler']}
 */
export function guardRoute(req, _, __) {
  const error = new ResourceNotFoundError(`Route ${req.url} not found`);
  error.statusCode = 404;
  throw error;
}
