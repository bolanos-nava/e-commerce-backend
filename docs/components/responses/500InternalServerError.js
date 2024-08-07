/** @type {import('swagger-jsdoc').Response} */
const _500InternalServerError = {
  description:
    'Internal Server Error: General error from the server. Could be due to malformed request or connection error',
  content: {
    'application/json': {
      example: {
        status: 'error',
        code: 'InternalServerError',
        message: ['Unexpected error'],
      },
    },
  },
};

export default _500InternalServerError;
