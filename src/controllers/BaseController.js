/* eslint-disable class-methods-use-this */
/**
 * @typedef {import('../types').Express} Express
 */

/**
 *
 * @abstract
 */
export default class BaseController {
  actions = [];

  /**
   * Adds routes and their actions to the router
   * @param {Express['Router']} router
   */
  setupActions(router) {
    this.actions.forEach((_action) => {
      const {
        spec: { path, method: httpMethod },
        actions,
      } = _action;

      if (Array.isArray(actions)) {
        // Sets up several actions for the same route (e.g. if you have middlewares)
        router[httpMethod.toLowerCase()](path, ...actions);
      } else {
        // Sets up the action for the method defined in spec
        router[httpMethod.toLowerCase()](path, actions);
      }
    });
  }

  /**
   * Defines every route with its path and actions, and adds them to the router
   * @param {Express['Router']} router Router to add routes
   */
  addRoutes(router) {}
}
