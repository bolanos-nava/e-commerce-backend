import path from 'node:path';
import { env } from '../../configs/index.js';
import { Product } from '../../models/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ObjectType} ObjectType
 * @typedef {{path: string, template: string, context: ObjectType}} View
 * @typedef {() => ObjectType | Promise<ObjectType>} ViewBodyGenerator
 */

export default class ViewsController {
  product = new Product(`${path.resolve()}/products.json`);

  /**
   * Adds views to the router
   * @param {ExpressType['Router']} router Router for the views
   */
  addViews = async (router) => {
    /** @type {View[]} */
    const views = [
      {
        path: '/',
        template: 'home',
        context: await this.getHomeBody(),
      },
      {
        path: '/realtimeproducts',
        template: 'realTimeProducts',
        context: await this.getRealTimeProductsBody(),
      },
    ];

    views.forEach((view) => {
      this.renderView(router, view);
    });
  };

  /** Renders view
   * @param {ExpressType['Router']} router Views router
   * @param {View} context Context to render the view with
   */
  // eslint-disable-next-line class-methods-use-this
  renderView(router, { path: viewPath, template, context }) {
    router.get(viewPath, (req, res) => {
      res.render(template, context);
    });
  }

  /** Returns context of home view
   * @type {ViewBodyGenerator}
   */
  getHomeBody = async () => {
    return {
      products: await this.product.getProducts(),
      title: 'Tienda | Inicio',
      stylesheet: '/css/products.css',
    };
  };

  /** Returns context of real time products view
   * @type {ViewBodyGenerator}
   */
  getRealTimeProductsBody = async () => {
    return {
      products: await this.product.getProducts(),
      title: 'Tienda | Productos',
      stylesheet: '/css/products.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };
  };
}
