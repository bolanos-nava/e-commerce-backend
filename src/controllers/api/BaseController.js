/* eslint-disable class-methods-use-this */
/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */

import { ParameterError } from '../../customErrors/index.js';

/**
 * Class for common controller methods
 */
export default class BaseController {
  validateIds(...ids) {
    ids.forEach((id) => {
      const [key, value] = Object.entries(id)[0];
      if (!value || typeof value === 'undefined' || value.length !== 24) {
        throw new ParameterError(`${key} is an invalid id`);
      }
    });
  }
}
