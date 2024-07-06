import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').MongoDaosType['carts']} CartsDao
 */

export default class CartsViewsController extends BaseViewsController {
  /** @type CartsDao */
  #cartsService;

  /**
   * Constructs a new controller for cart views
   *
   * @param {CartsDao} cartsService
   */
  constructor(cartsService) {
    super();
    this.#cartsService = cartsService;
  }

  renderCartDetailView = async (req, res, next) => {
    try {
      const { cartId } = req.params;

      const cart = await this.#cartsService.get(cartId, { lean: true });
      const context = {
        products: cart.products,
        title: 'Tienda | Carrito',
        stylesheet: '/css/index.css',
      };

      res.render('cart', context);
    } catch (error) {
      next(error);
    }
  };
}
