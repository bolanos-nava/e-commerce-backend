// TODO: finish categories scheme
import { Schema, model } from 'mongoose';
import BaseModel from './BaseModel.js';
import { DuplicateResourceError } from '../../../customErrors/DuplicateResourceError.js';

const categorySchema = {
  name: 'Category',
  schema: new Schema({
    code: {
      type: String,
      unique: true,
    },
    name: String,
  }),
};

export const Category = model(categorySchema.name, categorySchema.schema);

const categories = [
  { code: 'modules', name: 'Módulos fotovoltaicos' },
  { code: 'cables_connectors', name: 'Cables y conectores' },
  { code: 'inverters', name: 'Cables' },
];
