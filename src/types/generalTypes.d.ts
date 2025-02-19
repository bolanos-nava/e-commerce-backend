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
import { logger } from '../configs';

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

type SortOptions = 'PRICE_ASC' | 'PRICE_DESC' | 'DATE_ASC' | 'DATE_DESC';

export type ListOptions = {
  limit?: number;
  page?: number;
  sort?: string;
  lean?: boolean;
};

export type PaginateOptions = ListOptions & {
  sort?: {
    [key: string]: 1 | -1;
  };
};

export type JwtTokenFactoryType = JwtUtil;

export type ObjectType<T = any> = {
  [key: string]: T;
};

export type WSServer = Server;

type RequestLogger = Request & {
  logger: typeof logger;
  requestLogger: typeof logger;
};
type RequestWS = RequestLogger & { socketServer: WSServer };

export type ExpressType = {
  Express: ExpressJS;
  Request: Request;
  RequestWS: RequestWS;
  Response: Response;
  NextFunction: NextFunction;
  Router: Router;
  // RequestHandler: RequestHandler;
  RequestHandler: (
    req: RequestLogger,
    res: Response,
    next: NextFunction,
  ) => void;
  RequestHandlerWS: (req: RequestWS, res: Response, next: NextFunction) => void;
  ErrorRequestHandler: ErrorRequestHandler;
};

export type RepositoryType = {
  products: MongoDaosType['products'];
  carts: MongoDaosType['carts'];
  messages: MongoDaosType['messages'];
  users: MongoDaosType['users'];
};
