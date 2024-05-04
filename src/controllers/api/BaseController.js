/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */

export default class BaseController {
  /**
   * Routes of the controller
   * @type {ControllerRoute[]}
   */
  routes = [];

  /**
   * Adds routes and their actions to the router
   * @param {ExpressType['Router']} router
   */
  setupRoutes(router) {
    this.routes.forEach((route) => {
      const { path, actions } = route;
      const httpMethod = route.httpMethod.toLowerCase();

      if (Array.isArray(actions)) {
        // Sets up several actions for the same route (e.g. if you have middlewares)
        router[httpMethod](path, ...actions);
      } else {
        // Sets up the action for the method defined in spec
        router[httpMethod](path, actions);
      }
    });
  }
}
