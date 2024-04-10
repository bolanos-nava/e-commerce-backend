import express from 'express';
import { productsRouter, cartsRouter } from './routers/index.js';
import handlebars from 'express-handlebars';

// Initializing Express app
const server = express();

// Middleware that allows Express to interpret JSON requests
server.use(express.json());

// Configuring handlebars templating engine
server.engine('handlebars', handlebars.engine());
server.set('views', `${import.meta.dirname}/views`);
server.set('view engine', 'handlebars');

// Rendering the index view
server.get('/', (req, res) => {
  // First argument is the name of the view
  // Second argument has the variables to substitute in the layouts
  res.render('index', {
    name: 'Adrian',
    title: 'Fuck you very very much',
    permission: false,
    // products: [{ title: 'Shit' }, { title: 'Hell' }],
    products: ['shit', 'hell'],
  });
});

// Adding products router
server.use('/api/v1/products', productsRouter);
server.use('/api/v1/carts', cartsRouter);

const PORT = 3000;
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
