import os from 'node:os';
import BaseViewsController from './BaseViewsController.js';
import { env } from '../../configs/index.js';

/**
 * @typedef {import('../../types').ServicesType['products']} ProductsService
 */

export default class ProductsViewsController extends BaseViewsController {
  /** @type ProductsService */
  #productsService;

  /**
   * Constructs a new controller for products views
   *
   * @param {ProductsService} productsService
   */
  constructor(productsService) {
    super();
    this.#productsService = productsService;
  }

  renderProductsView = async (req, res, next) => {
    try {
      const { limit, page, sort, minPrice, maxPrice, categoryId, minStock } =
        req.query;
      const filter = {
        minPrice,
        maxPrice,
        categoryId,
        minStock,
      };

      const response = await this.#productsService.getAll(filter, {
        limit,
        page,
        sort,
        lean: true,
      });
      const context = {
        products: response.products,
        pagination: response.pagination,
        title: 'Tienda | Inicio',
        stylesheet: '/static/css/index.css',
        hostname: os.hostname(),
      };

      res.render('home', context);
    } catch (error) {
      next(error);
    }
  };

  renderRealTimeProductsView = async (req, res, _) => {
    const { WS_CLIENT_HOST, WS_CLIENT_PATH, USE_BUILT_IN_WS } = env;
    const { limit, page, sort, ...filter } = req.query;
    const response = await this.#productsService.getAll(filter, {
      limit,
      page,
      sort,
      lean: true,
    });
    const context = {
      products: response.products,
      pagination: response.pagination,
      title: 'Tienda | Inicio',
      stylesheet: '/static/css/index.css',
      hostname: os.hostname(),
      env: {
        WS_CLIENT_HOST,
        WS_CLIENT_PATH,
        USE_BUILT_IN_WS,
      },
    };

    res.render('realTimeProducts', context);
  };
}
