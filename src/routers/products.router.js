import { Router } from 'express';

export const productsRouter = Router();

/**
 * Returns the list of products
 */
productsRouter.get('/', async (req, res, next) => {
  try {
    const { limit } = req.query;
    let products = await req.productsManager.getProducts();
    if (limit && !isNaN(limit)) {
      const limt = Number(limit);
      products = products.slice(0, limt);
    }
    res.send(products);
  } catch (error) {
    next(error);
  }
});

/**
 * Returns data of one product
 */
productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await req.productsManager.getProductById(id);
    res.send(product);
  } catch (error) {
    next(error);
  }
});
