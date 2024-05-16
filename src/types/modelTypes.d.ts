import { MongoIdType } from './mongooseTypes';

export type ProductType = {
  id: MongoIdType;
  title: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  code: string;
  status: boolean;
  thumbnails?: string[];
};

export type CartProduct = {
  product: ProductType['id'];
  quantity: number;
};

export type CartType = {
  id: MongoIdType;
  products: CartProduct[];
};

export type MessageType = {
  id: MongoIdType;
  user: string;
  message: string;
};
