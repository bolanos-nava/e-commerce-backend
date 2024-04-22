export default class BaseController {
  actions = [];
  router;

  setupActions(router) {
    this.router = router;
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
}
