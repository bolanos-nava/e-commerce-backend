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
          operationId: 'ProductsController#list',
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
                        $ref: '#/components/schemas/ResponseStatus',
                      },
                      payload: {
                        type: 'object',
                        properties: {
                          products: {
                            type: 'array',
                            description: 'List of products',
                            items: {
                              $ref: '#/components/schemas/ProductResponse',
                            },
                          },
                          pagination: {
                            $ref: '#/components/schemas/Pagination',
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    success: {
                      summary: 'Successful response',
                      value: {
                        status: 'success',
                        payload: {
                          products: [
                            {
                              _id: '601d99860715d71f04580001',
                              name: 'Product 1',
                              description: 'Product 1 description',
                              price: 100,
                              stock: 5,
                              categoryId: 'cat1',
                              thumbnails: [],
                              createdAt: '2022-01-01T12:00:00.000Z',
                              updatedAt: '2022-01-02T12:00:00.000Z',
                            },
                            {
                              _id: '601d99860715d71f04580002',
                              name: 'Product 2',
                              description: 'Product 2 description',
                              price: 200,
                              stock: 10,
                              categoryId: 'cat2',
                              thumbnails: [
                                'https://example.com/image1.jpg',
                                'https://example.com/image2.jpg',
                              ],
                              createdAt: '2022-01-01T12:00:00.000Z',
                              updatedAt: '2022-01-02T12:00:00.000Z',
                            },
                          ],
                          pagination: {
                            totalDocs: 18,
                            limit: 10,
                            totalPages: 2,
                            page: 1,
                            pagingCounter: 1,
                            hasPrevPage: false,
                            hasNextPage: true,
                            prevPage: null,
                            nextPage: 2,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              $ref: '#/components/responses/500InternalServerError',
            },
          },
        },
        post: {
          summary: 'Adds a new product',
          tags: ['Products'],
          operationId: 'ProductsController#create',
          security: [{ jwtCookie: [] }],
          requestBody: {
            description: 'Data of the new product to add',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Product created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/ResponseStatus',
                          },
                          {
                            default: 'created',
                          },
                        ],
                      },
                      payload: {
                        type: 'object',
                        properties: {
                          product: {
                            $ref: '#/components/schemas/ProductResponse',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              $ref: '#/components/responses/401Unauthorized',
            },
            403: {
              $ref: '#/components/responses/403Forbidden',
            },
            409: {
              $ref: '#/components/responses/409DuplicatedProduct',
            },
            500: {
              $ref: '#/components/responses/500InternalServerError',
            },
          },
        },
      },
    },
    {
      path: '/{productId}',
      spec: {
        get: {
          summary: 'Returns a single product',
          operationId: 'ProductsController#show',
          tags: ['Products'],
          parameters: [
            {
              in: 'path',
              name: 'productId',
              description: 'Id of the product to get',
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
              required: true,
            },
          ],
          responses: {
            200: {
              description: 'Product found',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      {
                        $ref: '#/components/schemas/BaseJsonResponse',
                      },
                      {
                        type: 'object',
                        properties: {
                          payload: {
                            type: 'object',
                            properties: {
                              product: {
                                $ref: '#/components/schemas/ProductResponse',
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            404: {
              $ref: '#/components/responses/404ProductNotFound',
            },
            500: {
              $ref: '#/components/responses/500InternalServerError',
            },
          },
        },
        put: {
          summary: 'Updates an existing product',
          operationId: 'ProductsController#update',
          tags: ['Products'],
          security: [{ jwtCookie: [] }],
          parameters: [
            {
              in: 'path',
              name: 'productId',
              description: 'Id of the product to update',
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
              required: true,
            },
          ],
          requestBody: {
            description: 'Data of the new product to add',
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Product updated',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      {
                        $ref: '#/components/schemas/BaseJsonResponse',
                      },
                      {
                        type: 'object',
                        properties: {
                          payload: {
                            type: 'object',
                            properties: {
                              product: {
                                $ref: '#/components/schemas/ProductResponse',
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: {
              $ref: '#/components/responses/401Unauthorized',
            },
            403: {
              $ref: '#/components/responses/403Forbidden',
            },
            404: {
              $ref: '#/components/responses/404ProductNotFound',
            },
            500: {
              $ref: '#/components/responses/500InternalServerError',
            },
          },
        },
        delete: {
          summary: 'Removes a product',
          operationId: 'ProductsController#delete',
          tags: ['Products'],
          security: [{ jwtCookie: [] }],
          parameters: [
            {
              in: 'path',
              name: 'productId',
              description: 'Id of the product to delete',
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
              required: true,
            },
          ],
          responses: {
            204: {
              description: 'Product deleted successfully',
            },
            401: {
              $ref: '#/components/responses/401Unauthorized',
            },
            403: {
              $ref: '#/components/responses/403Forbidden',
            },
            404: {
              $ref: '#/components/responses/404ProductNotFound',
            },
            500: {
              $ref: '#/components/responses/500InternalServerError',
            },
          },
        },
      },
    },
  ],
};

export default productPaths;
