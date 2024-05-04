import { Document, Types } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';

interface ICart extends Document {
  products: { product: Types.ObjectId; quantity: Number }[];
}

export interface ICartModel extends BaseModel<ICart> {
  /**
   * Gets a product from a cart, or returns null if it doesn't exist
   * @param cartId
   * @param productId
   */
  findProductInCart(cartId: MongoIdType, productId: MongoIdType): Promise<any>;
}
