import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').MongoDaosType['products']} ProductsDao
 */

export default class ProductsViewsController extends BaseViewsController {
  /** @type ProductsDao */
  #productsService;

  /**
   * Constructs a new controller for products views
   *
   * @param {ProductsDao} productsService
   */
  constructor(productsService) {
    super();
    this.#productsService = productsService;
  }

  renderProductsView = async (req, res, next) => {
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
      stylesheet: '/css/index.css',
    };

    res.render('home', context);
  };

  renderRealTimeProductsView = async (req, res, next) => {
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
      stylesheet: '/css/index.css',
    };

    res.render('realTimeProducts', context);
  };
}
