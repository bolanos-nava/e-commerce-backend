/* eslint-disable no-console */
import path from 'node:path';
import express from 'express';
import session from 'express-session';
import hbs from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { passportMiddlewares } from './middlewares/index.js';
import { env } from './configs/index.js';

/**
 * @typedef {import('./types').ExpressType['Express']} ExpressInstance
 */

/**
 * Class to execute initial server configurations, like general middlewares and template engines
 */
export default class ServerConfiguration {
  static BASE_DIR = path.resolve();
  static PATHS = {
    PUBLIC: `${ServerConfiguration.BASE_DIR}/src/public`,
    VIEWS: `${ServerConfiguration.BASE_DIR}/src/views`,
  };

  /** @type {ExpressInstance} */
  server;

  /**
   * Instances a new ServerConfiguration object
   *
   * @param {ExpressInstance} server Express server instance
   */
  constructor() {
    this.server = express();
  }

  /**
   * Sets up initial middlewares
   */
  setupMiddlewares() {
    // Headers
    this.server.use((req, res, next) => {
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
    mongoose.connection.on('open', () =>
      console.log(
        `Connected successfully to MongoDB${NODE_ENV === 'dev' ? ` on URI ${DB_URI}` : ' Atlas cluster'}`,
      ),
    );
    mongoose.connection.on('error', () =>
      console.error('Failed to connect to database'),
    );
    mongoose.connection.on('disconnected', () =>
      console.error('Disconnected from database'),
    );
    try {
      await mongoose.connect(DB_URI, { dbName: DB_NAME });
    } catch (error) {
      console.error('Failed to connect to database');
    }
  }

  /**
   * Sets up sessions with MongoDB as store
   */
  setupSessions() {
    const { DB_URI } = env;
    this.server.use(
      session({
        store: MongoStore.create({
          mongoUrl: DB_URI,
          ttl: 60 * 15,
        }),
        secret: 'password', // TODO: write more secure password
        resave: true,
        saveUninitialized: true,
      }),
    );
  }

  setupPassport() {
    passportMiddlewares();
    this.server.use(passport.initialize());
    this.server.use(passport.session());
  }
}
