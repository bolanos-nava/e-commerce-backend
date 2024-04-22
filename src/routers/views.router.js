import { Router } from 'express';
import viewsController from '../controllers/views/index.js';

export const viewsRouter = Router();

viewsController.addViews(viewsRouter);

// viewsRouter.use(['/', '/realtimeproducts'], (req, res, next) => {
//   req.productsManager = new Product(`${path.resolve()}/src/products.json`);
//   next();
// });

// viewsRouter.route('/').get(async (req, res) => {
//   res.render('home', {
//     products: await req.productsManager.getProducts(),
//     title: 'Tienda | Inicio',
//     stylesheet: '/css/products.css',
//   });
// });

// viewsRouter.route('/realtimeproducts').get(async (req, res) => {
//   res.render('realTimeProducts', {
//     products: await req.productsManager.getProducts(),
//     stylesheet: '/css/products.css',
//     env: {
//       API_URL: env.API_URL,
//       PORT: env.PORT,
//     },
//   });
// });

// viewsRouter.route('/chat').get((req, res) => {
//   res.render('chat');
// });
