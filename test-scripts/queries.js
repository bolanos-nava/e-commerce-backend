/* eslint-disable no-undef */
const db = connect('mongodb://localhost:27017/estore');

const query = db.carts.find(
  {
    products: {
      $elemMatch: {
        product: '662ea0e9fef5300a89002403',
      },
    },
  },
  { 'products.$': 1 },
);
