import { Router } from 'express';
import { ProductsManager } from '../controllers/index.js';

export const productsRouter = Router();

// Middleware to instantiate ProductsManager
productsRouter.use((req, res, next) => {
  req.productsManager = new ProductsManager(
    `${import.meta.dirname}/../products.json`,
  );
  next();
});

/**
 * Returns the list of products
 */
productsRouter
  .route('/')
  .get(async (req, res, next) => {
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
  })
  .post(async (req, res, next) => {
    try {
      const { product } = req.body;
      await req.productsManager.createProduct(product);
      res.send('Product added');
    } catch (error) {
      next(error);
    }
  });

/**
 * Returns data of one product
 */
productsRouter
  .route('/:productId')
  .get(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await req.productsManager.getProductById(productId);
      res.send(product);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { product: newData } = req.body;
      await req.productsManager.updateProduct(productId, newData);
      res.send('Product updated');
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { productId } = req.params;
      await req.productsManager.deleteProduct(productId);
      res.send('Product deleted');
    } catch (error) {
      next(error);
    }
  });
