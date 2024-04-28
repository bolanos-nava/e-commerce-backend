import { Schema } from 'mongoose';

export const productSchema = {
  name: 'Product',
  schema: new Schema({
    title: {
      type: String,
      required: true,
      minLength: 1,
    },
    categoryId: {
      // type: Schema.ObjectId,
      type: String,
      // ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
      minLength: 1,
    },
    status: {
      type: Boolean,
      default: true,
    },
    thumbnails: [String],
  }),
};
