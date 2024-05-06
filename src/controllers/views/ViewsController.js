/* eslint-disable class-methods-use-this */
import { env } from '../../configs/index.js';
import { Product, Message } from '../../daos/models/index.js';

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
      {
        path: '/chat',
        template: 'chat',
        context: await this.getChatBody(),
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
      stylesheet: '/css/index.css',
    };
  };

  async getChatBody() {
    return {
      messages: await Message.find().lean(),
      title: 'Chat',
      stylesheet: '/css/index.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };
  }

  /** Returns context of real time products view
   * @type {ViewBodyGenerator}
   */
  getRealTimeProductsBody = async () => {
    return {
      products: await Product.find().lean(),
      title: 'Tienda | Productos',
      stylesheet: '/css/index.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };
  };
}
