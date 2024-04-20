import path from 'node:path';
import { env } from '../../configs/index.js';
import { Product } from '../../models/index.js';

export default class ViewsController {
  product = new Product(`${path.resolve()}/products.json`);

  /**
   * Adds actions and sets up routes in the router
   * @param {Router} router
   */
  async addViews(router) {
    const views = [
      {
        path: '/',
        template: 'home',
        body: await this.getHomeBody(),
      },
      {
        path: '/realtimeproducts',
        template: 'realTimeProducts',
        body: await this.getRealTimeProductsBody(),
      },
    ];

    views.forEach((view) => {
      this.renderView(router, view);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  renderView(router, { path: viewPath, template, body }) {
    router.get(viewPath, (req, res) => {
      res.render(template, body);
    });
  }

  async getHomeBody() {
    return {
      products: await this.product.getProducts(),
      title: 'Tienda | Inicio',
      stylesheet: '/css/products.css',
    };
  }

  async getRealTimeProductsBody() {
    return {
      products: await this.product.getProducts(),
      title: 'Tienda | Productos',
      stylesheet: '/css/products.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };
  }
}
