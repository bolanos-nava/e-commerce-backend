import * as CartSchemas from './CartSchemas.js';
import * as MongoModelSchema from './MongoModelSchema.js';
import * as PaginationSchemas from './PaginationSchemas.js';
import * as ProductSchemas from './ProductSchemas.js';
import * as ResponseSchemas from './ResponseSchemas.js';
import * as TicketSchemas from './TicketSchemas.js';

const schemas = {
  ...CartSchemas,
  ...MongoModelSchema,
  ...PaginationSchemas,
  ...ProductSchemas,
  ...ResponseSchemas,
  ...TicketSchemas,
};

export default schemas;
