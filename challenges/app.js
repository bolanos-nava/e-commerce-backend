import express from 'express';
import { ProductManager } from './controllers/index.js';

// Initializing Express app
const server = express();

// Middleware that allows Express to interpret JSON requests
server.use(express.json());

/** Routes definitions */
/**
 * Returns the list of products
 */
server.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const productManager = new ProductManager();
    let products = await productManager.getProducts();
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
server.get('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const productManager = new ProductManager();
    const product = await productManager.getProductById(id);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Middleware for error handling
server.use((error, req, res, next) => {
  res.status(error.statusCode).send(error.message || 'Something broke!');
});
