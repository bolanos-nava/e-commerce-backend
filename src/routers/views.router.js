import path from 'node:path';
import { Router } from 'express';
import { ProductsManager } from '../controllers/index.js';

export const viewsRouter = Router();

viewsRouter.route('/').get((req, res) => {
  res.render('index', {
    name: 'Adrian',
    title: 'Tienda | Inicio',
  });
});

viewsRouter.use(['/products', '/realtimeproducts'], (req, res, next) => {
  req.productsManager = new ProductsManager(
    `${path.resolve()}/src/products.json`,
  );
  next();
});

viewsRouter.route('/products').get(async (req, res) => {
  res.render('home', {
    products: await req.productsManager.getProducts(),
  });
});

viewsRouter.route('/realtimeproducts').get(async (req, res) => {
  res.render('realTimeProducts', {
    products: await req.productsManager.getProducts(),
  });
});

viewsRouter.route('/chat').get((req, res) => {
  res.render('chat');
});
