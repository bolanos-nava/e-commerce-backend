import { Document, Types } from 'mongoose';
import { BaseModel } from './BaseModel';
import { MongoIdType } from './mongooseTypes';

export type MessageType = {
  user: string;
  message: string;
};

interface IMessage extends MessageType, Document<MessageType> {
  _id: MongoIdType;
}

export interface IMessageModel extends BaseModel<IMessage> {}
