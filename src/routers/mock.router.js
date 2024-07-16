import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { Product } from '../daos/mongo/index.js';

export const mockRouter = Router();

mockRouter.get('/mockingproducts', (req, res) => {
  const fakeProducts = Array.from(
    { length: 50 },
    () =>
      new Product({
        title: faker.commerce.productName(),
        categoryId: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int(0),
        code: faker.string.uuid(),
        thumbnails: [faker.image.url({ width: 200, height: 200 })],
      }),
  );

  res.json({
    status: 'success',
    payload: { products: fakeProducts },
  });
});
