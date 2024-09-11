import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import BaseModel from './BaseModel.js';
import { DuplicateResourceError } from '../../../customErrors/DuplicateResourceError.js';

/**
 * @typedef {import('../../../types').IUserModel} IUserModel
 */

// TODO: re-add validations
const userSchema = {
  name: 'User',
  schema: new Schema(
    {
      firstName: {
        type: String,
        required: true,
        // minLength: 3,
      },
      lastName: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        required: true,
        // minLength: 5,
        unique: true, // generates unique index
      },
      password: {
        type: String,
        default: '',
        // minLength: 8,
        // maxLength: 16,
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      },
      cart: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      lastActiveAt: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true },
  ),
};

userSchema.schema.plugin(paginate);

userSchema.schema.post(
  ['save', 'update', 'findOneAndUpdate'],
  function throwUniquenessError(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new DuplicateResourceError('Email already registered'));
    }
    next();
  },
);

class UserModel extends BaseModel {
  static findByEmail(email) {
    return this.findOne({ email });
  }
}

/** @type {IUserModel} */
export const User = model(
  userSchema.name,
  userSchema.schema.loadClass(UserModel),
);
