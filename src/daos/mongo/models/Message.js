import { Schema, model } from 'mongoose';
import BaseModel from './BaseModel.js';

/**
 * @typedef {import('../../../types').IMessageModel} IMessageModel
 */

const messageSchema = {
  name: 'Message',
  schema: new Schema(
    {
      user: {
        type: String,
        required: true,
        minLength: 1,
      },
      message: {
        type: String,
        required: true,
        minLength: 1,
      },
    },
    { timestamps: true },
  ),
};

class MessageModel extends BaseModel {}

/** @type {IMessageModel} */
export const Message = model(
  messageSchema.name,
  messageSchema.schema.loadClass(MessageModel),
);
