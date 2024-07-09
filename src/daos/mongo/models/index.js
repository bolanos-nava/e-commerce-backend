import { Cart } from './Cart.js';
import { Message } from './Message.js';
import { Product } from './Product.js';
import { Ticket } from './Ticket.js';
import { User } from './User.js';

export * from './Cart.js';
export * from './Message.js';
export * from './Product.js';
export * from './Ticket.js';
export * from './User.js';

const models = {
  Cart,
  Message,
  Product,
  Ticket,
  User,
};

export default models;
