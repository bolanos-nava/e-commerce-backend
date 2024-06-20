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
import services from '../services';

export type UUIDType = `${string}-${string}-${string}-${string}`;

export type ServicesType = typeof services;

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
