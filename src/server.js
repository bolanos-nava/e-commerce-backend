import express from 'express';
import { productsRouter, cartsRouter } from './routers/index.js';
import { ProductsManager } from './controllers/index.js';

// Initializing Express app
const server = express();

// Middleware that allows Express to interpret JSON requests
server.use(express.json());

// Adding products router
server.use('/api/v1/products', productsRouter);
server.use('/api/v1/carts', cartsRouter);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Middleware for error handling
server.use((error, req, res, next) => {
  res.status(error.statusCode || 500).send({
    status: 'error',
    message: error.message || 'Something broke!',
  });
});
