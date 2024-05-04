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
];

export default productsDocs;
