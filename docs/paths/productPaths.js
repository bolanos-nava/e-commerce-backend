/**
 * @typedef {import('swagger-jsdoc').PathItem} PathItem
 */

/** @type {{
 * basePath: string;
 * routes: {
 *  path: string;
 *  spec: PathItem;
 * }[];
}} */
const productPaths = {
  basePath: '/products',
  routes: [
    {
      path: '/',
      spec: {
        get: {
          summary: 'Returns list of products',
          operationId: 'list',
          tags: ['Products'],
          parameters: [
            {
              name: 'limit',
              in: 'query',
              description: 'Number of records to return per page',
              schema: {
                type: 'integer',
                default: 10,
                minimum: 0,
              },
            },
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              schema: {
                type: 'integer',
                default: 1,
                minimum: 1,
              },
            },
            {
              name: 'sort',
              in: 'query',
              description: 'Direction to sort products',
              schema: {
                type: 'string',
                enum: ['desc', 'asc'],
                default: 'asc',
              },
            },
            {
              name: 'minPrice',
              in: 'query',
              description: 'Minimum price of listed products',
              schema: {
                type: 'number',
                minimum: 0,
              },
            },
            {
              name: 'maxPrice',
              in: 'query',
              description: 'Maximum price of listed products',
              schema: {
                type: 'number',
                minimum: 0,
              },
            },
            {
              name: 'categoryId',
              in: 'query',
              description: 'Id of category to filter products',
              schema: {
                type: 'string',
              },
            },
            {
              name: 'minStock',
              in: 'query',
              description: 'Minimum stock of listed products',
              schema: {
                type: 'integer',
                minimum: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        $ref: '#/components/schemas/responseStatus',
                      },
                      payload: {
                        type: 'object',
                        properties: {
                          products: {
                            type: 'array',
                            description: 'List of products',
                            items: {
                              $ref: '#/components/schemas/product',
                            },
                          },
                          paginationResponse: {
                            type: 'object',
                            description: 'Object containing pagination data',
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    success: {
                      summary: 'Successful response',
                      value: [
                        {
                          _id: '601d99860715d71f04580001',
                          name: 'Product 1',
                          description: 'Product 1 description',
                          price: 100,
                          stock: 5,
                          categoryId: '601d99860715d71f04580000',
                        },
                        {
                          _id: '601d99860715d71f04580002',
                          name: 'Product 2',
                          description: 'Product 2 description',
                          price: 200,
                          stock: 10,
                          categoryId: '601d99860715d71f04580000',
                        },
                      ],
                    },
                  },
                },
              },
            },
            500: {
              $ref: '#/components/responses/ErrorResponse',
            },
          },
        },
        post: {
          summary: 'Adds a new product',
          tags: ['Products'],
          parameters: [
            {
              in: 'body',
              name: 'product',
            },
          ],
          responses: {
            201: {
              description: 'Product created',
            },
          },
        },
      },
    },
  ],
};

export default productPaths;
