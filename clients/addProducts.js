/* eslint-disable */
import env from '../src/configs/envLoader.js';

const CATEGORIES = Object.freeze({
  CAT1: 'cat1',
  CAT2: 'cat2',
});

const products = [
  {
    title: '',
    categoryId: CATEGORIES.CAT1,
    description: '',
    price: 50,
    stock: 20,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT1,
    description: '',
    price: 100.5,
    stock: 30,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT1,
    description: '',
    price: 500,
    stock: 30,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT1,
    description: '',
    price: 50,
    stock: 20,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT2,
    description: '',
    price: 10,
    stock: 2,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT2,
    description: '',
    price: 30,
    stock: 60,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT2,
    description: '',
    price: 50,
    stock: 10,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT2,
    description: '',
    price: 10,
    stock: 1000,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT1,
    description: '',
    price: 60,
    stock: 2,
    code: '',
  },
  {
    title: '',
    categoryId: CATEGORIES.CAT1,
    description: '',
    price: 6000,
    stock: 5,
    code: '',
  },
];

(async () => {
  await products.reduce(async (prevPromise, product, idx) => {
    await prevPromise;

    product.title = `Product ${idx + 1}`;
    product.description = `This is product ${idx + 1}`;
    product.code = `prod${idx + 1}`;

    const response = await fetch(`${env.API_URL}:${env.PORT}/api/v1/products`, {
      method: 'POST',
      body: JSON.stringify({ product }),
    });
    try {
      console.log(await response.json());
    } catch (error) {
      console.log('Resp ok? ', response.ok);
    }
  }, Promise.resolve());
})();
