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

  async renderProductsView(req, res, next) {
    const logParams = {
      function: `${ProductsViewsController.name}::${this.renderProductsView.name}`,
    };
    try {
      const { limit, page, sort, minPrice, maxPrice, categoryId, minStock } =
        req.query;
      const filter = {
        minPrice,
        maxPrice,
        categoryId,
        minStock,
        status: true,
      };

      const response = await this.#productsService.getAll(filter, {
        limit,
        page,
        sort,
        lean: true,
      });

      req.requestLogger.debug(
        `Current user has token: ${Boolean(req.cookies.token)}`,
        logParams,
      );
      req.requestLogger.debug(
        'User from req',
        { payload: req.user },
        logParams,
      );
      const context = {
        ...this.getBaseContext(req),
        products: response.products,
        pagination: response.pagination,
        title: 'Tienda | Inicio',
        pageHeader: 'Productos',
        stylesheet: '/static/css/index.css',
        hostname: os.hostname(),
      };

      res.render('home', context);
    } catch (error) {
      next(error);
    }
  }

  async renderRealTimeProductsView(req, res, _) {
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
  }
}
