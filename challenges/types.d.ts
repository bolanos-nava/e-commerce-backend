type ObjectType<T = any> = {
  [key: string]: T;
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  code: string;
  stock: number;
};
