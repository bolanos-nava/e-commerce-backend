import { Document, Types } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';

interface ICart extends Document {
  products: { product: Types.ObjectId; quantity: Number }[];
  print(): void;
}

export interface ICartModel extends BaseModel<ICart> {
  /**
   * Gets a product from a cart, or returns null if it doesn't exist
   *
   * @param cartId
   * @param productId
   * @returns Promise that resolves to null or to a product in the cart
   */
  findProductInCart(cartId: MongoIdType, productId: MongoIdType): Promise<any>;

  /**
   * Removes a product from a cart
   *
   * @param cartId
   * @param productId
   */
  removeOneProduct(cartId: MongoIdType, productId: MongoIdType): Promise<any>;

  /**
   * Removes all products from a cart
   *
   * @param cartId
   */
  removeAllProducts(cartId: MongoIdType): Promise<any>;
}
