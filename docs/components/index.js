import parameters from './parameters/index.js';
import responses from './responses/index.js';
import schemas from './schemas/index.js';
import securitySchemes from './securitySchemes/index.js';

/** @type {import('swagger-jsdoc').Components} */
const components = {
  parameters,
  responses,
  schemas,
  securitySchemes,
};

export default components;
