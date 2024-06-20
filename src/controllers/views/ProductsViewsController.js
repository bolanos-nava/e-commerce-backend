/* eslint-disable class-methods-use-this */
import { env } from '../../configs/index.js';
import services from '../../services/index.js';

export default class ProductsViewsController {
  async renderProductsView(req, res, next) {
    console.log(req.session);
    console.log(req.cookies);
    const { limit, page, sort, ...filter } = req.query;
    const response = await services.products.getProducts(filter, {
      limit,
      page,
      sort,
      lean: true,
    });
    const context = {
      products: response.payload.products,
      pagination: response.payload.pagination,
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
    const { limit, page, sort, ...filter } = req.query;
    const response = await services.products.getProducts(filter, {
      limit,
      page,
      sort,
      lean: true,
    });
    const context = {
      products: response.payload.products,
      pagination: response.payload.pagination,
      title: 'Tienda | Inicio',
      stylesheet: '/css/index.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };

    res.render('realTimeProducts', context);
  }
}
