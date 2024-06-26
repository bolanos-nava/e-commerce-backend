import {
  Cart,
  CartsMongoDao,
  Message,
  MessagesMongoDao,
  Product,
  ProductsMongoDao,
  User,
  UsersMongoDao,
} from '../daos/mongo/index.js';

const mongoServicesFactory = {
  products: new ProductsMongoDao(Product),
  carts: new CartsMongoDao(Cart, Product),
  messages: new MessagesMongoDao(Message),
  users: new UsersMongoDao(User),
};

export default mongoServicesFactory;
