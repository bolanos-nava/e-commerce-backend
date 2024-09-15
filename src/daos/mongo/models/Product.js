import { Schema, model } from 'mongoose';
import paginatePlugin from 'mongoose-paginate-v2';
import BaseModel from './BaseModel.js';
import { DuplicateResourceError } from '../../../customErrors/DuplicateResourceError.js';

/**
 * @typedef {import('../../../types').IProductModel} IProductModel
 */

const productSchema = {
  name: 'Product',
  schema: new Schema(
    {
      title: {
        type: String,
        required: true,
        minLength: 1,
        index: true,
      },
      categoryId: {
        // type: Schema.ObjectId,
        type: String,
        // ref: 'Category',
        required: true,
        index: true,
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
        index: true,
      },
      code: {
        type: String,
        required: true,
        minLength: 1,
        unique: true, // generates unique index
      },
      status: {
        type: Boolean,
        default: true,
      },
      thumbnails: [String],
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    { timestamps: true },
  ),
};
productSchema.schema.plugin(paginatePlugin);

productSchema.schema.post(
  ['save', 'update', 'findOneAndUpdate'],
  function throwUniquenessError(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(
        new DuplicateResourceError(
          `Product with code ${doc.code} already exists`,
        ),
      );
    }
    next();
  },
);

class ProductModel extends BaseModel {
  static findByCode(code) {
    return this.findOne({ code });
  }
}

/** @type {IProductModel} */
export const Product = model(
  productSchema.name,
  productSchema.schema.loadClass(ProductModel),
);
