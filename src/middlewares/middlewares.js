import { ZodError } from 'zod';
import passport from 'passport';
import {
  ForbiddenError,
  ResourceNotFoundError,
  UnauthorizedError,
} from '../customErrors/index.js';
import services from '../services/index.js';
import logger from '../configs/logger.js';

/**
 * @typedef {import('../types').ExpressType} ExpressType
 * @typedef {import('../types').WSServer} WSServer
 * @typedef {import('../types').ObjectType} ObjectType
 */

/**
 * Middleware to catch all errors
 *
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

/**
 * Middleware to log incoming HTTP requests
 *
 * @param {string} message - Message to log
 * @returns {ExpressType['RequestHandler']} Express middleware function with appended request logger
 */
export function logHttp(message) {
  return (req, _, next) => {
    req.requestLogger.http(message);
    req.requestLogger.debug(`Token exists? ${Boolean(req.cookies.token)}`);
    next();
  };
}

/**
 * Wrapper function for Passport strategies. It handles errors and anonymous user authorization
 *
 * @param {string} strategy - Name of Passport strategy
 * @param {ObjectType} passportOpts - Options that can be passed to the strategy
 * @returns {ExpressType['RequestHandler']} Express middleware function
 */
export function passportStrategyErrorWrapper(strategy, passportOpts = {}) {
  return (req, res, next) => {
    logger.debug(`Passport strategy: ${strategy}`);
    if (req.isAnonymous) return next();
    return passport.authenticate(
      strategy,
      { session: false, ...(passportOpts || {}) },
      (error, sessionData, info) => {
        console.log(error, sessionData, info);
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

/**
 * Function to return an array of middlewares used for authorizing or denying requests based on the roles. Includes logic to allow anonymous users as well
 *
 * @param  {...string} roles
 * @returns Array of authorization middlewares
 */
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
}

/**
 * Middleware to update the lastActiveAt field of the logged user
 */
export function updateLastActiveAtMiddleware() {
  return [
    (req, res, next) => {
      logger.debug('Checking if there is JWT');
      if (req?.cookies?.token && !req.user) {
        return passportStrategyErrorWrapper('jwt')(req, res, next);
      }
      next();
    },
    async (req, res, next) => {
      try {
        if (req.user) {
          logger.debug('Updating last active at');
          const result = await services.users.updateLastConnection(
            req.user.email,
          );
          if (!result) {
            logger.debug('Clearing cookies');
            req.cookies.token = null;
            res.clearCookie('token');
          }
        }
        next();
      } catch (error) {
        next(error);
      }
    },
  ];
}

/**
 * Appends the websocket server instance to the request object
 *
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
