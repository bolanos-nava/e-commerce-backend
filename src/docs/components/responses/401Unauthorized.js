/** @type {import('swagger-jsdoc').Response} */
const _401Unauthorized = {
  description:
    'Unauthorized: Token is malformed, invalid, expired or is not present in the request',
  content: {
    'application/json': {
      example: {
        status: 'error',
        code: 'UnauthorizedError',
        message: ['No token present'],
      },
    },
  },
};

export default _401Unauthorized;
