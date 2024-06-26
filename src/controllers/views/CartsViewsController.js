import env from '../../configs/envLoader.js';
import repository from '../../services/repository.js';

export default class CartsViewsController {
  async renderCartDetailView(req, res, next) {
    try {
      const { cartId } = req.params;

      const cart = await repository.carts.get(cartId, { lean: true });
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
