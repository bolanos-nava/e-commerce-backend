import docs from '../controllers/api/docs/index.js';

const swaggerPaths = {};
docs.forEach((doc) => {
  const { basePath, routes } = doc;
  routes.forEach((route) => {
    const { path, spec } = route;
    swaggerPaths[`${basePath}${path}`] = spec;
  });
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
