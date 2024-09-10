/** @type {import('swagger-jsdoc').Response} */
const _404ProductNotFound = {
  description: 'Not found: Product not found',
  content: {
    'application/json': {
      example: {
        status: 'error',
        code: 'ResourceNotFoundError',
        message: ['Product with id XXXXXXXXXXXXXXXXXXXXXXXX not found'],
      },
    },
  },
};

export default _404ProductNotFound;
