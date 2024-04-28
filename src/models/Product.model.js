import { model } from 'mongoose';
import { productSchema } from '../schemas/mongoose/index.js';
import { getProductValidator } from '../schemas/zod/product.validator.js';
import BaseMongooseModel from './Base.model.js';

const { name, schema } = productSchema;

class ProductMongooseModel extends BaseMongooseModel {
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

export const ProductModel = model(name, schema.loadClass(ProductMongooseModel));
