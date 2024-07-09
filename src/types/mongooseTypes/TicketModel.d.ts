import { Document } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';
import { IProduct, IUser } from '../../daos/mongo';
import { UUIDType } from '../generalTypes';
import { CartProduct } from './CartModel';

export type TicketType = {
  code: UUIDType;
  amount: number;
  purchaser: string;
  purchaseDatetime: string;
  products: CartProduct[];
};

interface ITicket extends Document<TicketType>, TicketType {
  _id: MongoIdType;
}

export interface ITicketModel extends BaseModel<ITicket> {
  /**
   * Fetches ticket by purchaser
   *
   * @param email - User email
   */
  findByPurchaser(email: IUser['email']): Promise<ITicket>;
}
