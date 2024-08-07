/** @type {import('swagger-jsdoc').Response} */
const _409DuplicatedProduct = {
  description: 'Conflict: product with same code already exists',
  content: {
    'application/json': {
      example: {
        status: 'error',
        code: 'DuplicatedResourceError',
        message: ['Product with id XXXXXXXXXXXXXXXXXXXXXXXX already exists'],
      },
    },
  },
};

export default _409DuplicatedProduct;
