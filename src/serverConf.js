import path from 'node:path';
import express from 'express';
import hbs from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { passportStrategies } from './middlewares/index.js';
import { env, logger } from './configs/index.js';

/**
 * @typedef {import('./types').ExpressType['Express']} ExpressInstance
 */

/**
 * Singleton class to execute initial server configurations, like general middlewares and template engines
 */
export default class ServerConfiguration {
  static BASE_DIR = path.resolve();
  static PATHS = {
    PUBLIC: `${ServerConfiguration.BASE_DIR}/src/public`,
    VIEWS: `${ServerConfiguration.BASE_DIR}/src/views`,
  };

  /** @type {ExpressInstance} */
  server;

  /** @type ServerConfiguration */
  static #instance;

  /**
   * Instances a new ServerConfiguration object
   *
   * @param {ExpressInstance} server Express server instance
   */
  constructor() {
    this.server = express();
  }

  /**
   * Singleton method. Initializes a new ServerConfiguration or returns existing instance
   *
   * @returns ServerConfiguration instance
   */
  static get instance() {
    if (!this.#instance) {
      this.#instance = new ServerConfiguration();
    }
    return this.#instance;
  }

  /**
   * Sets up initial middlewares
   */
  setupMiddlewares() {
    // Headers
    this.server.use((_, res, next) => {
      res.removeHeader('x-powered-by');
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    });
    // Interprets JSON requests
    this.server.use(express.json());
    // Use encoded URL
    this.server.use(express.urlencoded({ extended: true }));
    // Serves static files to the client
    this.server.use(express.static(ServerConfiguration.PATHS.PUBLIC));
  }

  /**
   * Sets up the template engines to use
   */
  setupTemplateEngines() {
    const hbsHelpers = {
      json(content) {
        return JSON.stringify(content);
      },
    };

    this.server.engine(
      'hbs',
      hbs.engine({
        extname: '.hbs',
        helpers: hbsHelpers,
      }),
    );
    this.server.set('views', ServerConfiguration.PATHS.VIEWS);
    this.server.set('view engine', 'hbs');
  }

  /**
   * Sets up MongoDB
   */
  async setupDb() {
    const { NODE_ENV, DB_URI, DB_NAME } = env;
    const db = mongoose.connection;
    let attempts = 0;
    db.on('open', () =>
      logger.info(
        `Connected successfully to MongoDB${NODE_ENV === 'dev' ? ` on URI ${DB_URI}` : ' Atlas cluster'}`,
      ),
    );
    db.on('error', async () => {
      logger.error('Failed to connect to database');
      mongoose.disconnect();
    });
    db.on('disconnected', async () => {
      mongoose.connect(DB_URI, { dbName: DB_NAME }).catch(() => {
        attempts++;
        logger.fatal(
          `Couldn't connect to database. Retrying... Attempt number: ${attempts}`,
        );
      });
    });

    logger.info('Connecting to database...');
    mongoose.connect(DB_URI, { dbName: DB_NAME }).catch(() => {
      attempts++;
      logger.fatal(
        `Couldn't connect to database. Retrying... Attempt number: ${attempts}`,
      );
    });
  }

  /**
   * Sets up passport configurations
   */
  setupPassport() {
    // We will save the JWT as cookies
    this.server.use(cookieParser());
    // Sets up passport strategies
    passportStrategies();
    // Initializes passport
    this.server.use(passport.initialize());
  }

  /**
   * Adds logger to the request object
   *
   * @returns {typeof logger} Logger object
   */
  setupLogger() {
    this.server.use((req, _, next) => {
      req.logger = logger;
      req.requestLogger = logger.child({
        method: req.method,
        path: req.path,
      });
      next();
    });
    return logger;
  }
}
