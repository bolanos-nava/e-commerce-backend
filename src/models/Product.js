import { Schema, model } from 'mongoose';
// import { productSchema } from '../schemas/mongoose/index.js';
import { getProductValidator } from '../schemas/zod/product.validator.js';
import BaseModel from './BaseModel.js';

// const { name, schema } = productSchema;

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

class ProductModel extends BaseModel {
  static findByCode(code) {
    return this.findOne({ code });
  }
  async productValidator(isPartial = false) {
    let found = await model('Product').findByCode(this.code);
    // We only count the found product if it is not the same as this product
    found = found && found.id !== this.id;

    let validator = getProductValidator(this, found);
    if (isPartial) validator = validator.partial();
    return validator.parse(this);
  }
}

export const Product = model(
  productSchema.name,
  productSchema.schema.loadClass(ProductModel),
);
