import { env } from '../../configs/index.js';
import repository from '../../services/repository.js';

export default class ProductsViewsController {
  async renderProductsView(req, res, next) {
    console.log('session', req.session);
    console.log('cookies', req.cookies);
    console.log('query', req.query);
    const { limit, page, sort, minPrice, maxPrice, categoryId, minStock } =
      req.query;
    const filter = {
      minPrice,
      maxPrice,
      categoryId,
      minStock,
    };
    console.log('filter', filter);
    const response = await repository.products.getAll(filter, {
      limit,
      page,
      sort,
      lean: true,
    });
    console.log('resp', response);
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
    const response = await repository.products.getAll(filter, {
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
