import { Document, Types, UpdateWriteOpResult } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';
import { IProduct } from './ProductModel';
import { IUser } from '../../daos/mongo';

export type CartProduct = {
  product: IProduct['_id'];
  quantity: number;
};

export type CartType = {
  products: CartProduct[];
  user: IUser['_id'];
};

interface ICart extends Document<CartType>, CartType {
  _id: MongoIdType;
}

interface ICartPopulated extends ICart {
  products: (CartProduct & { product: IProduct })[];
}

export interface ICartModel extends BaseModel<ICart> {
  /**
   * Gets a product from a cart, or returns null if it doesn't exist
   *
   * @param cartId
   * @param productId
   * @returns Promise that resolves to null or to a product in the cart
   */
  findProductInCart(
    cartId: ICart['id'],
    productId: IProduct['_id'],
  ): Promise<CartProduct>;

  /**
   * Removes a product from a cart
   *
   * @param cartId
   * @param productId
   */
  removeOneProduct(
    cartId: ICart['_id'],
    productId: IProduct['_id'],
  ): Promise<UpdateWriteOpResult>;

  /**
   * Removes all products from a cart
   *
   * @param cartId
   */
  removeAllProducts(cartId: ICart['_id']): Promise<UpdateWriteOpResult>;
}
