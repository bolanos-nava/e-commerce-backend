/** @type {import('swagger-jsdoc').Schema} */
export const Ticket = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      format: 'uuid',
      unique: true,
      description: 'Unique identifier for the ticket',
    },
    amount: {
      type: 'number',
      format: 'float',
      description: 'Amount of money the ticket represents',
    },
    purchaser: {
      type: 'string',
      format: 'email',
      description: 'Email of the purchaser',
    },
    products: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/CartProduct',
      },
      description: 'Products associated with the ticket',
    },
  },
  required: ['code', 'amount', 'purchaser', 'products'],
  example: {
    code: '8e1f3761-7461-40f8-8a08-f06985d16897',
    amount: 100.0,
    purchaser: 'john.doe@example.com',
    products: [
      {
        product: '5f7a775a9f77f5109a559248',
        quantity: 2,
        price: 150.0,
        totalPrice: 300.0,
      },
      {
        product: '5f7a775a9f77f5109a559249',
        quantity: 1,
        price: 200.0,
        totalPrice: 200.0,
      },
    ],
  },
};

/** @type {import('swagger-jsdoc').Schema} */
export const TicketResponse = {
  allOf: [
    { $ref: '#/components/schemas/Ticket' },
    {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          format: 'ObjectId',
          description: 'MongoDB id of the ticket',
        },
        purchaseDateTime: {
          type: 'string',
          format: 'date-time',
          description: 'Date and time of the purchase',
        },
      },
    },
  ],
};
