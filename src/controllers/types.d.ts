export type ObjectType<T = any> = {
  [key: string]: T;
};

export type UUIDType = `${string}-${string}-${string}-${string}`;

export type Product = {
  id: UUIDType;
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
  product: Product['id'];
  quantity: number;
};

export type Cart = {
  id: UUIDType;
  products: CartProduct[];
};

export default {
  ObjectType,
  Product,
  CartProduct,
  Cart,
  UUIDType,
};
