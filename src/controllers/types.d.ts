export type ObjectType<T = any> = {
  [key: string]: T;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  code: string;
  stock: number;
};

export default { ObjectType, Product };
