/** @type {import('swagger-jsdoc').Schema} */
export const Pagination = {
  type: 'object',
  properties: {
    totalDocs: {
      type: 'integer',
      description: 'Total number of documents',
    },
    limit: {
      type: 'integer',
      description: 'Number of documents per page',
    },
    totalPages: {
      type: 'integer',
      description: 'Total number of pages',
    },
    page: {
      type: 'integer',
      description: 'Current page number',
    },
    pagingCounter: {
      type: 'integer',
    },
    hasPrevPage: {
      type: 'boolean',
      description: 'Check if there is a previous page',
    },
    hasNextPage: {
      type: 'boolean',
      description: 'Check if there is a next page',
    },
    prevPage: {
      type: 'integer',
      description: 'Previous page number',
    },
    nextPage: {
      type: 'integer',
      description: 'Next page number',
    },
  },
  required: [
    'totalDocs',
    'limit',
    'totalPages',
    'page',
    'pagingCounter',
    'hasPrevPage',
    'hasNextPage',
    'prevPage',
    'nextPage',
  ],
};
