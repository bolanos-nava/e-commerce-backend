import _404ProductNotFound from './404ProductNotFound.js';
import _409DuplicatedProduct from './409DuplicatedProduct.js';

const productResponses = {
  '404ProductNotFound': _404ProductNotFound,
  '409DuplicatedProduct': _409DuplicatedProduct,
};

export default productResponses;
