import { transports, format, createLogger } from 'winston';
import env from './envLoader.js';

const LEVELS = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const COLORS = {
  fatal: 'magenta',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'cyan',
};

const minLevel = (() => {
  switch (env.NODE_ENV) {
    case 'dev':
      return 'debug';
    case 'prod':
      return 'info';
    default:
      return 'info';
  }
})();

const logger = createLogger({
  levels: LEVELS,
  transports: [
    new transports.Console({
      level: minLevel,
      format: format.combine(
        // format.colorize({ colors: COLORS }),
        // format.printf(
        //   (info) => `${info.timestamp} | [${info.level}]: ${info.message}`,
        // ),
        format.timestamp(),
        format.json({ space: 2 }),
      ),
    }),
    new transports.File({
      filename: 'errors.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json({ space: 2 })),
    }),
  ],
});

export default logger;
