import { Document, Types } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';
import { IProduct } from './ProductModel';

interface ICartProduct {
  product: Types.ObjectId;
  quantity: Number;
}
interface ICart extends Document {
  products: ICartProduct[];
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
    cartId: MongoIdType,
    productId: MongoIdType,
  ): Promise<ICartProduct>;

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
