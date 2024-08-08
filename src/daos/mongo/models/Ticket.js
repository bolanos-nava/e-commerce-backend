import { Schema, model } from 'mongoose';
import BaseModel from './BaseModel.js';

/**
 * @typedef {import('../../../types').ITicketModel} ITicketModel
 */

const ticketSchema = {
  name: 'Ticket',
  schema: new Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
      },
      amount: {
        type: Number,
        required: true,
        
      },
      purchaser: {
        // TODO: add reference to user email
        type: String,
        required: true,
        index: true,
      },
      products: [
        {
          // TODO: add reference to product id
          product: Schema.Types.ObjectId,
          quantity: Number,
        },
      ],
    },
    {
      timestamps: { createdAt: 'purchaseDatetime' },
    },
  ),
};

class TicketModel extends BaseModel {
  static findByPurchaser(email) {
    return this.findOne({ email });
  }
}

/** @type {ITicketModel} */
export const Ticket = model(
  ticketSchema.name,
  ticketSchema.schema.loadClass(TicketModel),
);
