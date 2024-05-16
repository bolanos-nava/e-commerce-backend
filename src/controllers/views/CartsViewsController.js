/* eslint-disable class-methods-use-this */
import services from '../../services/index.js';

export default class CartsViewsController {
  async renderCartDetailView(req, res, next) {
    try {
      const { cartId } = req.params;

      const cart = await services.carts.getCart(cartId, { lean: true });
      const context = {
        products: cart.products,
        title: 'Tienda | Carrito',
        stylesheet: '/css/index.css',
      };

      res.render('cart', context);
    } catch (error) {
      next(error);
    }
  }
}
