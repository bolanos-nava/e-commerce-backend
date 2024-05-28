import { ResourceNotFoundError } from '../../customErrors/index.js';

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

  static async findOneAndThrow(filter, { lean = false, property } = {}) {
    const resource = await this.findOne(filter, {}, { lean });
    if (!resource) {
      const customMessage = property
        ? ` with ${property.name} ${property.value} `
        : '';
      throw new ResourceNotFoundError(
        `${this.modelName}${customMessage}not found`,
      );
    }
    return resource;
  }
}
