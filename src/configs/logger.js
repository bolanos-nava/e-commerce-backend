import { transports, format, createLogger } from 'winston';

const LEVELS = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

// Colors for printing to console in standard format
const COLORS = {
  fatal: 'magenta',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  http: 'blue',
  debug: 'cyan',
};

const envLevelsMapping = {
  dev: 'debug',
  prod: 'info',
};
const minLevel = envLevelsMapping[process.env.NODE_ENV || 'prod'];

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
