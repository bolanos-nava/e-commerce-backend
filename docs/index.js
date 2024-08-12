import paths from './paths/index.js';
import components from './components/index.js';

const swaggerPaths = {};
paths.forEach((doc) => {
  const { basePath, routes } = doc;
  routes.forEach((route) => {
    const { path, spec } = route;
    swaggerPaths[`${basePath}${path}`] = spec;
  });
});

/** @type {import('swagger-jsdoc').OAS3Definition} */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-commerce API',
    version: '0.1.0',
    description: 'Express API for an e-commerce',
  },
  servers: [
    {
      url: 'http://{host}:{port}/api/{apiVersion}',
      description: 'Development server',
      variables: {
        host: {
          default: 'localhost',
        },
        port: {
          enum: [8080, 80, 3000],
          default: 8080,
        },
        apiVersion: {
          default: 'v1',
        },
      },
    },
    {
      url: 'http://localhost/api/{apiVersion}',
      description: 'Kubernetes server',
      variables: {
        apiVersion: {
          default: 'v1',
        },
      },
    },
    {
      url: '{protocol}://{host}:{port}/api/{apiVersion}',
      description: 'Custom server',
      variables: {
        protocol: {
          description: 'Protocol',
          enum: ['http', 'https'],
          default: 'http',
        },
        host: {
          default: 'localhost',
        },
        port: {
          type: 'number',
          default: 8080,
        },
        apiVersion: {
          type: 'string',
          default: 'v1',
        },
      },
    },
  ],
  paths: swaggerPaths,
  components,
};

export default swaggerDefinition;
