import {
  Express,
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import { Server } from 'socket.io';

export type UUIDType = `${string}-${string}-${string}-${string}`;

export type ObjectType<T = any> = {
  [key: string]: T;
};

export type WSServer = Server;

type RequestWS = Request & { socketServer: WSServer };

export type Express = {
  Express: Express;
  Request: Request;
  RequestWS: RequestWS;
  Response: Response;
  NextFunction: NextFunction;
  Router: Router;
  RequestHandler: RequestHandler;
  RequestHandlerWS: (req: RequestWS, res: Response, next: NextFunction) => void;
  ErrorRequestHandler: ErrorRequestHandler;
};
