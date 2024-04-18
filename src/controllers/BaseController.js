export default class BaseController {
  actions = [];
  router;

  setupActions(router) {
    this.router = router;
    this.actions.forEach((_action) => {
      const {
        spec: { path, method: httpMethod },
        action,
      } = _action;

      // Sets up the action for the method defined in spec
      router[httpMethod.toLowerCase()](path, action);
    });
  }
}
