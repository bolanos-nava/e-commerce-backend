import { Schema, model } from 'mongoose';
import BaseModel from './BaseModel.js';
import { DuplicateResourceError } from '../../customErrors/DuplicateResourceError.js';

/**
 * @typedef {import('../../types').IProductModel} IProductModel
 */

const productSchema = {
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

productSchema.schema.pre('save', async function validateDuplicatedCode() {
  const productWithSameCode = await model('Product').findOne({
    _id: { $ne: this.id },
    code: this.code,
  });

  if (productWithSameCode) {
    throw new DuplicateResourceError(
      `Product with code ${this.code} already exists`,
    );
  }
});

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
