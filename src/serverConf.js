import path from 'node:path';
import express from 'express';
import hbs from 'express-handlebars';

/**
 * @typedef {import('./types').Express} Express
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

  server;

  /**
   * Instances a new ServerConfiguration object
   * @param {Express} server Express server instance
   */
  constructor(server) {
    this.server = server;
  }

  /**
   * Sets up initial middlewares
   */
  setupMiddlewares() {
    // Interprets JSON requests
    this.server.use(express.json());
    //
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
}
