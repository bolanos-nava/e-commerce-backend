/* eslint-disable class-methods-use-this */
import env from '../../configs/envLoader.js';
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
        env: {
          API_URL: env.API_URL,
          PORT: env.PORT,
        },
      };

      res.render('cart', context);
    } catch (error) {
      next(error);
    }
  }
}
