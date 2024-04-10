import { Router } from 'express';
import { randomUUID } from 'node:crypto';
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
      res.send({
        status: 'success',
        payload: products,
      });
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { product } = req.body;
      product.code = product.code + randomUUID();
      const newProduct = await req.productsManager.createProduct(product);
      res.status(201).send({
        status: 'created',
        payload: newProduct,
      });
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
      res.send({
        status: 'success',
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { product: newData } = req.body;
      const updatedProduct = await req.productsManager.updateProduct(
        productId,
        newData,
      );
      res.send({
        status: 'updated',
        payload: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const deletedProduct = await req.productsManager.deleteProduct(productId);
      res.send({
        status: 'deleted',
        payload: deletedProduct,
      });
    } catch (error) {
      next(error);
    }
  });
