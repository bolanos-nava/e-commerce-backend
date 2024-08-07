import _401Unauthorized from './401Unauthorized.js';
import _403Forbidden from './403Forbidden.js';
import _500InternalServerError from './500InternalServerError.js';
import productResponses from './productResponses/index.js';

/**
 * @typedef {import('swagger-jsdoc').Response} Response
 * @typedef {import('../../../src/types').ObjectType<Response>} ResponsesType
 */

/** @type {ResponsesType} */
const responses = {
  '401Unauthorized': _401Unauthorized,
  '403Forbidden': _403Forbidden,
  '500InternalServerError': _500InternalServerError,
  ...productResponses,
};

export default responses;
