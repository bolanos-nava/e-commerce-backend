import { SchemaType } from 'mongoose';
import { ResourceNotFoundError } from '../customErrors/index.js';

/** @type {SchemaType} */
export default class BaseMongooseModel {
  static async findByIdAndThrow(id) {
    const resource = await this.findById(id);
    if (!resource) {
      throw new ResourceNotFoundError(
        `${this.modelName} with id ${id} not found`,
      );
    }
    return resource;
  }
}
