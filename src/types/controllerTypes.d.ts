import { ExpressType } from './generalTypes';

export type ControllerRoute = {
  path: String;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  actions:
    | ExpressType['RequestHandlerWS' | 'RequestHandler']
    | ExpressType['RequestHandlerWS' | 'RequestHandler'][];
};
