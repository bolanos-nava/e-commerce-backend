import product from './productSchema.js';
import { cart, cartProduct } from './cartSchema.js';
import { JSONResponse, responseStatus } from './jsonResponseSchema.js';

const schemas = {
  product,
  cart,
  cartProduct,
  JSONResponse,
  responseStatus,
};

export default schemas;
