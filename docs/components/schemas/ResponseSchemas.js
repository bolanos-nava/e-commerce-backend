/** @type {import('swagger-jsdoc').Schema} */
export const ResponseStatus = {
  type: 'string',
  enum: ['success', 'updated', 'created', 'error'],
  description:
    'Status code of the response (not equal to the HTTP status code)',
};

/** @type {import('swagger-jsdoc').Schema} */
export const ResponseErrorCode = {
  type: 'string',
  description: 'Error codename',
};

/** @type {import('swagger-jsdoc').Schema} */
export const ResponseErrorMessages = {
  type: 'array',
  description: 'List of error messages',
  items: {
    type: 'string',
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const BaseJsonResponse = {
  type: 'object',
  properties: {
    status: {
      $ref: '#/components/schemas/ResponseStatus',
    },
    payload: {
      type: 'object',
      description: 'Data of the response',
    },
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const NotFoundErrorResponse = {
  type: 'object',
  properties: {
    status: {
      allOf: [
        {
          $ref: '#/components/schemas/ResponseStatus',
        },
        {
          default: 'error',
        },
      ],
    },
    code: {
      allOf: [
        {
          $ref: '#/components/schemas/ResponseErrorCode',
        },
        {
          default: 'ResourceNotFoundError',
        },
      ],
    },
    message: {
      allOf: [
        {
          $ref: '#/components/schemas/ResponseErrorMessages',
        },
        {
          default: ['Resource with id XXXXXXXXXXXXXXXXXXXXXXXX not found'],
        },
      ],
    },
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const DuplicatedResourceErrorResponse = {
  type: 'object',
  properties: {
    status: {
      allOf: [
        {
          $ref: '#/components/schemas/ResponseStatus',
        },
        {
          default: 'error',
        },
      ],
    },
    code: {
      allOf: [
        {
          $ref: '#/components/schemas/ResponseErrorCode',
        },
        {
          default: 'DuplicatedResourceError',
        },
      ],
    },
    message: {
      allOf: [
        {
          $ref: '#/components/schemas/ResponseErrorMessages',
        },
        {
          default: ['Resource with id XXXXXXXXXXXXXXXXXXXXXXXX already exists'],
        },
      ],
    },
  },
};
