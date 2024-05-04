/* eslint-disable no-param-reassign */
import docs from '../controllers/api/docs/index.js';

const swaggerPaths = {};
docs.forEach((doc) => {
  swaggerPaths[doc.path] = doc.spec;
});

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-commerce API',
    version: '1.0.0',
    description: 'API built in Express for our e-commerce API',
  },
  servers: [
    {
      url: 'http://{host}:{port}/api/v1',
      variables: {
        host: {
          default: 'localhost',
        },
        port: {
          enum: [8080, 80],
          default: 8080,
        },
      },
      description: 'Development server',
    },
  ],
  paths: swaggerPaths,
};

export default swaggerDefinition;
