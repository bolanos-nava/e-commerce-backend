/**
 * @typedef {import('swagger-jsdoc').Response} Response
 * @typedef {import('../../../src/types').ObjectType<Response>} ResponsesType
 */

/** @type {ResponsesType} */
const responses = {
  ErrorResponse: {
    description:
      'General error from the server. Could be due to malformed request or connection error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['error'],
              default: 'error',
              description: 'Error status',
            },
            code: {
              type: 'string',
              description: 'Name of the error',
            },
            message: {
              type: 'array',
              description: 'Error messages',
              items: {
                type: 'string',
              },
            },
          },
          required: ['status', 'code', 'message'],
        },
        examples: {
          InternalServerError: {
            summary: 'Internal server error',
            value: {
              status: 'error',
              code: 'InternalServerError',
              message: ['Unexpected error'],
            },
          },
          DuplicateResourceError: {
            summary: 'Duplicate resource error',
            value: {
              status: 'error',
              code: 'DuplicateResourceError',
              message: [
                'Product with id 5f7a775a9f77f5109a559248 already exists',
              ],
            },
          },
        },
      },
    },
  },
};

export default responses;
