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
const cartPaths = {
  basePath: '/carts',
  routes: [
    {
      path: '/',
      spec: {
        post: {
          summary: 'Creates a new cart',
          operationId: 'CartsController#create',
          tags: ['Carts'],
          responses: {
            201: {
              description: 'Cart created',
              content: {
                'application/json': {
                  examples: {
                    'With user': {
                      summary: 'Cart created with user',
                      value: {
                        status: 'created',
                        payload: {
                          cart: {
                            _id: '5f2026e2f240473797b59d07',
                            products: [],
                            user: '5f2026e2f240473797b59d06',
                          },
                        },
                      },
                    },
                    Anonymous: {
                      summary: 'Cart created without user',
                      value: {
                        status: 'created',
                        payload: {
                          cart: {
                            _id: '5f2026e2f240473797b59d07',
                            products: [],
                            user: null,
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
      },
    },
    {
      path: '/{cartId}',
      spec: {
        get: {
          summary: 'Returns a single cart',
          operationId: 'CartsController#show',
          tags: ['Carts'],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to get',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          responses: {
            200: {
              description: 'Cart found',
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
                          status: { default: 'success' },
                          payload: {
                            type: 'object',
                            properties: {
                              cart: {
                                $ref: '#/components/schemas/CartResponse',
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
            404: { $ref: '#/components/responses/404CartNotFound' },
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
      },
    },
    {
      path: '/{cartId}/products',
      spec: {
        post: {
          summary: 'Adds products to the cart',
          description:
            "This endpoint adds products that don't exist yet and increases quantity of the ones that are already added",
          operationId: 'CartsController#addProductsToCart',
          tags: ['Carts'],
          security: [{ jwtCookie: [] }],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to add products to',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          requestBody: {
            description: 'List of products to add to the cart',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/CartProduct',
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description:
                'Cart updated successfully: products added. The response shows only the products that were added/updated',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/BaseJsonResponse' },
                      {
                        type: 'object',
                        properties: {
                          status: { default: 'updated' },
                          payload: {
                            type: 'object',
                            properties: {
                              cart: {
                                $ref: '#/components/schemas/CartResponse',
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
            401: { $ref: '#/components/responses/401Unauthorized' },
            403: { $ref: '#/components/responses/403Forbidden' },
            404: { $ref: '#/components/responses/404CartNotFound' },
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
        delete: {
          summary: 'Removes all products from a cart',
          operationId: 'CartsController#removeProducts',
          tags: ['Carts'],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to remove products from',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          responses: {
            204: { description: 'Cart updated successfully: products removed' },
            404: { $ref: '#/components/responses/404CartNotFound' },
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
      },
    },
    {
      path: '/{cartId}/products/{productId}',
      spec: {
        post: {
          summary: 'Adds a new product to the cart',
          description:
            'This endpoint adds a new product to the cart. If the product already exists in the cart, it increases its quantity',
          operationId: 'CartsController#addProductToCart',
          tags: ['Carts'],
          security: [{ jwtCookie: [] }],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to add the product to',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
            {
              in: 'path',
              name: 'productId',
              description: 'Id of the product to add to the cart',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          requestBody: {
            description:
              'Quantity of the product to add to the cart. If the product does not exist, the product is added with the specified quantity. If the product exists, the quantity is increased. If the body is empty, quantity is set to 1.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    quantity: { type: 'integer', default: 1 },
                  },
                },
                examples: {
                  'Add 10 units': {
                    summary: 'Add 10 units of the product',
                    value: {
                      quantity: 10,
                    },
                  },
                  Empty: {
                    summary: 'Add 1 unit of the product',
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description:
                'Cart updated successfully: product added/updated. The response shows only the product that was added/updated',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/BaseJsonResponse' },
                      {
                        type: 'object',
                        properties: {
                          status: { default: 'updated' },
                          payload: {
                            type: 'object',
                            properties: {
                              cart: {
                                type: 'object',
                                properties: {
                                  _id: {
                                    type: 'string',
                                    format: 'ObjectId',
                                  },
                                  product: {
                                    type: 'string',
                                    format: 'ObjectId',
                                  },
                                  quantity: {
                                    type: 'integer',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                  examples: {
                    Updated: {
                      summary: 'Product added/updated',
                      value: {
                        status: 'updated',
                        payload: {
                          cart: {
                            _id: '5f27d81489a116832c20438d',
                            product: '5f27d81489a116832c20438c',
                            quantity: 10,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/401Unauthorized' },
            403: { $ref: '#/components/responses/403Forbidden' },
            404: { $ref: '#/components/responses/404CartNotFound' },
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
        put: {
          summary: 'Sets quantity of a product in a cart',
          description:
            "This endpoint is _idempotent_: it doesn't increase quantity, it sets it to the sent value. Additionally, it assumes the cart exists.",
          operationId: 'CartsController#setProductQuantity',
          tags: ['Carts'],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to update the product in',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
            {
              in: 'path',
              name: 'productId',
              description: 'Id of the product to update in the cart',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          requestBody: {
            description:
              'Quantity to set in the product. If body is undefined, by default quantity is 1',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    quantity: { type: 'integer', default: 1 },
                  },
                },
                examples: {
                  'Set quantity to 10 units': {
                    summary: 'Add 10 units of the product',
                    value: {
                      quantity: 10,
                    },
                  },
                  Empty: {
                    summary: 'Set quantity to one unit',
                  },
                },
              },
            },
          },
          responses: {
            204: { description: 'Cart updated successfully: new quantity set' },
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
        delete: {
          summary: 'Removes a product from the cart',
          description:
            'Removes the specified product from the cart. If the product is not in the cart, it does nothing',
          operationId: 'CartsController#removeProductFromCart',
          tags: ['Carts'],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to remove the product from',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
            {
              in: 'path',
              name: 'productId',
              description: 'Id of the product to remove from the cart',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          responses: {
            204: { description: 'Cart updated successfully: product removed' },
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
      },
    },
    {
      path: '/{cartId}/tickets',
      spec: {
        post: {
          summary: 'Creates a new ticket from the products in the cart',
          description:
            'This endpoints creates a new ticket in the Tickets collection from the products in the cart. If some product is not found or the quantity in the cart is greater than the available stock, that product stays in the cart.',
          operationId: 'CartsController#createTicket',
          tags: ['Carts'],
          security: [{ jwtCookie: [] }],
          parameters: [
            {
              in: 'path',
              name: 'cartId',
              description: 'Id of the cart to add the ticket to',
              required: true,
              schema: {
                type: 'string',
                format: 'ObjectId',
              },
            },
          ],
          responses: {
            201: {
              description: 'Ticket created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/BaseJsonResponse' },
                      {
                        type: 'object',
                        properties: {
                          status: { default: 'created' },
                          payload: {
                            type: 'object',
                            properties: {
                              ticket: {
                                $ref: '#/components/schemas/Ticket',
                              },
                              unavailableProducts: {
                                type: 'array',
                                items: {
                                  $ref: '#/components/schemas/CartProduct',
                                },
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
            500: { $ref: '#/components/responses/500InternalServerError' },
          },
        },
      },
    },
  ],
};

export default cartPaths;
