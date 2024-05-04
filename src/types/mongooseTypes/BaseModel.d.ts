import { Document } from 'mongoose';
import { Model } from 'mongoose';
import { MongoIdType } from './mongooseTypes';
import { ResourceNotFoundError } from '../../customErrors';

export interface BaseModel<T> extends Model<T> {
  /**
   * Attempts to fetch the resource with the specified id and throws if it doesn't exist
   * @param id Id of the resource
   * @throws {ResourceNotFoundError}
   */
  findByIdAndThrow(id: MongoIdType): Promise<Document<any, any, T>>;
}
