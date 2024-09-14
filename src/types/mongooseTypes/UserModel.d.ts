import { Document } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';
import { ICart } from '../../daos/mongo';

export type UserType = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'user_premium';
  cart: ICart['_id'];
  lastActiveAt: Date;
};

interface IUser extends Document<UserType>, UserType {
  _id: MongoIdType;
}

export interface IUserModel extends BaseModel<IUser> {
  /**
   * Fetches user by email
   *
   * @param email User email
   */
  findByEmail(email: IUser['email']): Promise<IUser>;
}
