import { FilterQuery, Model, PaginateOptions, PaginateResult } from 'mongoose';
import { ObjectType } from '../generalTypes';
import { ResourceNotFoundError } from '../../customErrors';

export interface BaseModel<T> extends Model<T> {
  /**
   * Attempts to fetch the resource with the specified id and throws if it doesn't exist
   *
   * @param id Id of the resource
   * @throws {ResourceNotFoundError}
   */
  findByIdAndThrow(id: T['_id']): Promise<T>;
  // findByIdAndThrow(id: MongoIdType): Promise<Document<any, any, T>>;

  /**
   * Attempts to fetch the resource based on some filter
   *
   * @param filter Query to filter the collection
   * @throws {ResourceNotFoundError}
   */
  findOneAndThrow(
    filter: FilterQuery<T>,
    options: {
      lean: boolean;
      errorMessage: String;
      errorProperty: { name: string; value: any };
    },
  ): Promise<T>;

  paginate: (
    query?: FilterQuery<T>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<T>>;
}
