const productsDocs = [
  {
    path: '/products',
    spec: {
      get: {
        summary: 'Returns list of products',
        parameters: [
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successful response',
          },
        },
      },
    },
  },
  {
    path: '/products',
  },
];

const productDocss = {
  basePath: '/products',
  routes: [
    {
      path: '/',
      spec: {
        get: {
          summary: 'Returns list of products',
          parameters: [
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
              },
            },
          ],
          responses: {
            200: {
              description: 'Successful response',
            },
          },
        },
        post: {
          summary: 'Adds a new product',
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

export default productDocss;
