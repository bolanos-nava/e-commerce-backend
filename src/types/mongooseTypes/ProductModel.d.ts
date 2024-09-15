import { Document } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';
import { IUser } from './UserModel';

export type ProductType = {
  title: string;
  categoryId: string;
  description: string;
  price: number;
  stock: number;
  code: string;
  status: boolean;
  thumbnails?: string[];
  createdBy: IUser['_id'];
};

interface IProduct extends Document<ProductType>, ProductType {
  _id: MongoIdType;
}

interface IProductPopulated extends IProduct {
  createdBy: IUser;
}

export interface IProductModel extends BaseModel<IProduct> {
  /**
   * Fetches product by code
   * @param code Code of product
   */
  findByCode(code: IProduct['code']): Promise<IProduct>;
}
