/* eslint-disable class-methods-use-this */
import { env } from '../../configs/index.js';
import { Product } from '../../daos/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ObjectType} ObjectType
 * @typedef {{path: string, template: string, context: ObjectType}} View
 * @typedef {() => ObjectType | Promise<ObjectType>} ViewBodyGenerator
 */

export default class ViewsController {
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
      router.get(view.path, (req, res) => {
        res.render(view.template, view.context);
      });
    });
  };

  /** Returns context of home view
   * @type {ViewBodyGenerator}
   */
  getHomeBody = async () => {
    return {
      products: await Product.find().lean(),
      title: 'Tienda | Inicio',
      stylesheet: '/css/products.css',
    };
  };

  /** Returns context of real time products view
   * @type {ViewBodyGenerator}
   */
  getRealTimeProductsBody = async () => {
    return {
      products: await Product.find().lean(),
      title: 'Tienda | Productos',
      stylesheet: '/css/products.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };
  };
}
