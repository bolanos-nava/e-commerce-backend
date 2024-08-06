export const responseStatus = {
  type: 'string',
  enum: ['success', 'updated', 'created'],
  description: 'HTTP status code of the response',
};

export const JSONResponse = {
  type: 'object',
  properties: {
    status: {
      $ref: '#/components/schemas/responseStatus',
    },
    payload: {
      type: 'object',
      description: 'Data of the response',
    },
  },
};
