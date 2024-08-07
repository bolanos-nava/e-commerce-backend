import * as cartSchemas from './CartSchemas.js';
import * as paginationSchemas from './PaginationSchemas.js';
import * as productSchemas from './ProductSchemas.js';
import * as responseSchemas from './ResponseSchemas.js';

const schemas = {
  ...cartSchemas,
  ...paginationSchemas,
  ...productSchemas,
  ...responseSchemas,
};

export default schemas;
