import {
  Express as ExpressJS,
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import { Server } from 'socket.io';
import { JwtUtil } from '../utils';
import {
  CartsMongoDao,
  MessagesMongoDao,
  ProductsMongoDao,
  TicketsMongoDao,
  UsersMongoDao,
} from '../daos/mongo';
import services from '../services';

export type UUIDType = `${string}-${string}-${string}-${string}`;

export type MongoDaosType = {
  carts: CartsMongoDao;
  messages: MessagesMongoDao;
  products: ProductsMongoDao;
  tickets: TicketsMongoDao;
  users: UsersMongoDao;
};

export type ServicesType = typeof services;

export type ProductsFilterType = {
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  minStock?: number;
};

export type ListOptions = {
  limit?: number;
  page?: number;
  sort?: 'ASC' | 'DESC';
  lean?: boolean;
};

export type JwtTokenFactoryType = JwtUtil;

export type ObjectType<T = any> = {
  [key: string]: T;
};

export type WSServer = Server;

type RequestWS = Request & { socketServer: WSServer };

export type ExpressType = {
  Express: ExpressJS;
  Request: Request;
  RequestWS: RequestWS;
  Response: Response;
  NextFunction: NextFunction;
  Router: Router;
  RequestHandler: RequestHandler;
  RequestHandlerWS: (req: RequestWS, res: Response, next: NextFunction) => void;
  ErrorRequestHandler: ErrorRequestHandler;
};

export type RepositoryType = {
  products: MongoDaosType['products'];
  carts: MongoDaosType['carts'];
  messages: MongoDaosType['messages'];
  users: MongoDaosType['users'];
};
