import { Document, Types } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';

interface IMessage extends Document {
  username: String;
  message: String;
}

export interface IMessageModel extends BaseModel<IMessage> {}
