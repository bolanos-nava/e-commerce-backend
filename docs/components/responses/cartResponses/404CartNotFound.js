/** @type {import('swagger-jsdoc').Response} */
const _404CartNotFound = {
  description: 'Not found: Cart not found',
  content: {
    'application/json': {
      example: {
        status: 'error',
        code: 'ResourceNotFoundError',
        message: ['Cart with id XXXXXXXXXXXXXXXXXXXXXXXX not found'],
      },
    },
  },
};

export default _404CartNotFound;
