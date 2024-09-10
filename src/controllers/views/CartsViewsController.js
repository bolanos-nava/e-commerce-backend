import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').ServicesType['carts']} CartsService
 */

export default class CartsViewsController extends BaseViewsController {
  /** @type CartsService */
  #cartsService;

  /**
   * Constructs a new controller for cart views
   *
   * @param {CartsService} cartsService
   */
  constructor(cartsService) {
    super();
    this.#cartsService = cartsService;
  }

  async renderCartDetailView(req, res, next) {
    try {
      const { cartId } = req.params;

      const cart = await this.#cartsService.get(cartId, { lean: true });
      const context = {
        products: cart.products,
        title: 'Tienda | Carrito',
        stylesheet: '/static/css/index.css',
      };

      res.render('cart', context);
    } catch (error) {
      next(error);
    }
  }
}
