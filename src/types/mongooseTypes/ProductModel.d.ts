import { Document } from 'mongoose';
import { BaseModel } from './BaseModel';

interface IProduct extends Document {
  title: String;
  categoryId: String;
  description: String;
  price: Number;
  stock: Number;
  code: String;
  status: Boolean;
  thumbnails: String[];
}

export interface IProductModel extends BaseModel<IProduct> {
  /**
   * Fetches product by code
   * @param code Code of product
   */
  findByCode(code: IProduct['code']): Document<IProduct>;
}
