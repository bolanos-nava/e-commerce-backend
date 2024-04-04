import express from 'express';
import { productsRouter } from './routers/index.js';
import { ProductsManager } from './controllers/index.js';

// Initializing Express app
const server = express();

// Middleware to instantiate ProductsManager
server.use('*', (req, res, next) => {
  req.productsManager = new ProductsManager(
    `${import.meta.dirname}/products.json`,
  );
  next();
});

// Middleware that allows Express to interpret JSON requests
server.use(express.json());

// Adding products router
server.use('/v1/products', productsRouter);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Middleware for error handling
server.use((error, req, res, next) => {
  res.status(error.statusCode || 500).send(error.message || 'Something broke!');
  wwwwwwwwwwwwwww;
});
