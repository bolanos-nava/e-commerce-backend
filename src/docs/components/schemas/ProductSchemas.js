/** @type {import('swagger-jsdoc').Schema} */
export const Product = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Product title',
    },
    categoryId: {
      type: 'string', // TODO: change this when I implement categories collection
      description: 'Product category',
    },
    description: {
      type: 'string',
      description: 'Product description',
    },
    price: {
      type: 'number',
      description: 'Product price',
    },
    stock: {
      type: 'integer',
      description: 'Product stock',
      minimum: 1,
    },
    code: {
      type: 'string',
      description: 'Product unique code',
      unique: true,
    },
    status: {
      type: 'boolean',
      description: 'Defines availability of product',
      default: true,
    },
    thumbnails: {
      type: 'array',
      description: 'Array of product images',
      items: {
        type: 'uri',
      },
      default: [],
    },
  },
  required: ['title', 'categoryId', 'description', 'price', 'stock', 'code'],
  example: {
    title: 'Product 1',
    categoryId: 'furniture',
    description: 'Product 1 description',
    price: 10.99,
    stock: 100,
    status: true,
    thumbnails: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const ProductResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/Product',
    },
    {
      $ref: '#/components/schemas/MongoModelSchema',
    },
  ],
};
