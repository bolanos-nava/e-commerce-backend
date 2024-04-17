import path from 'node:path';
import { Router } from 'express';
import { ProductsManager } from '../controllers/index.js';

export const viewsRouter = Router();

viewsRouter.use(['/', '/realtimeproducts'], (req, res, next) => {
  req.productsManager = new ProductsManager(
    `${path.resolve()}/src/products.json`,
  );
  next();
});

viewsRouter.route('/').get(async (req, res) => {
  res.render('home', {
    products: await req.productsManager.getProducts(),
    title: 'Tienda | Inicio',
    stylesheet: '/css/products.css',
  });
});

viewsRouter.route('/realtimeproducts').get(async (req, res) => {
  res.render('realTimeProducts', {
    products: await req.productsManager.getProducts(),
    stylesheet: '/css/products.css',
  });
});

viewsRouter.route('/chat').get((req, res) => {
  res.render('chat');
});
