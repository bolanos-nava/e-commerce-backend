/** @type {import('swagger-jsdoc').Schema} */
export const CartProduct = {
  type: 'object',
  properties: {
    product: {
      type: 'string',
      description: 'MongoDB id of the product',
      format: 'ObjectId',
    },
    quantity: {
      type: 'integer',
      description: 'Product quantity currently added to cart',
      minimum: 1,
    },
  },
  required: ['product', 'quantity'],
  example: {
    product: '5f7a775a9f77f5109a559248',
    quantity: 2,
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const Cart = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CartProduct',
      },
      default: [],
    },
  },
  example: {
    products: [
      {
        product: '5f7a775a9f77f5109a559248',
        quantity: 2,
      },
      {
        product: '5f7a775a9f77f5109a559249',
        quantity: 1,
      },
    ],
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const CartResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/Cart',
    },
    {
      $ref: '#/components/schemas/MongoModelSchema',
    },
  ],
};
