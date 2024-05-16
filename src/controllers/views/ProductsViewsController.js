/* eslint-disable class-methods-use-this */
import { env } from '../../configs/index.js';
import services from '../../services/index.js';

export default class ProductsViewsController {
  async renderProductsView(req, res, next) {
    const products = await services.products.getProducts();
    const context = {
      products: products.map((product) => product.toObject()),
      title: 'Tienda | Inicio',
      stylesheet: '/css/index.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };

    res.render('home', context);
  }

  async renderRealTimeProductsView(req, res, next) {
    const products = await services.products.getProducts();
    const context = {
      products: products.map((p) => p.toObject()),
      title: 'Tienda | Productos',
      stylesheet: '/css/index.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };

    res.render('realTimeProducts', context);
  }
}
