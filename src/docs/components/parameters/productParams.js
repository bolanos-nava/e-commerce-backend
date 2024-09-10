/** @type {import('swagger-jsdoc').Parameter} */
export const productIdParam = {
  name: 'productId',
  in: 'path',
  description: 'MongoDB id of the product',
  required: true,
  schema: {
    type: 'string',
    format: 'ObjectId',
  },
};
