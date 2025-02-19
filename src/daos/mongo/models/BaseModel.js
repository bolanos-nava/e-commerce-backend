import logger from '../../../configs/logger.js';
import { ResourceNotFoundError } from '../../../customErrors/index.js';

/**
 * @typedef {import('../../types').BaseModel} BaseModel
 */

/** @type {BaseModel<any>} */
export default class BaseModel {
  static async findByIdAndThrow(id, { lean = false } = {}) {
    const resource = await this.findById(id, {}, { lean });
    if (!resource) {
      throw new ResourceNotFoundError(
        `${this.modelName} with id ${id} not found`,
      );
    }
    return resource;
  }

  static async findOneAndThrow(
    filter,
    { lean = false, errorMessage, errorProperty } = {},
  ) {
    logger.debug(
      `${BaseModel.findOneAndThrow.name} called with: ${JSON.stringify(filter)}`,
      {
        function: `${BaseModel.name}#${BaseModel.findOneAndThrow.name}`,
      },
    );
    const resource = await this.findOne(filter, {}, { lean });
    if (!resource) {
      const customMessage = errorProperty
        ? ` with ${errorProperty.name} ${errorProperty.value} `
        : '';
      throw new ResourceNotFoundError(
        errorMessage || `${this.modelName}${customMessage}not found`,
      );
    }
    return resource;
  }
}
