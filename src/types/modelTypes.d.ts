export type ProductType = {
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
  product: ProductType['id'];
  quantity: number;
};

export type CartType = {
  id: UUIDType;
  products: CartProduct[];
};
