import { Product } from './Product.js';
import { Cart } from './Cart.js';
import { Message } from './Message.js';
import { User } from './User.js';

export * from './Product.js';
export * from './Cart.js';
export * from './Message.js';
export * from './User.js';

const models = {
  Product,
  Cart,
  Message,
  User,
};

export default models;
