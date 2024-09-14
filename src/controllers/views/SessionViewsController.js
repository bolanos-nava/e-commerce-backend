import BaseViewsController from './BaseViewsController.js';

export default class SessionViewsController extends BaseViewsController {
  renderRegisterView(req, res, next) {
    try {
      res.render('register', this.getBaseContext(req));
    } catch (error) {
      next(error);
    }
  }

  renderLoginView(req, res, next) {
    try {
      res.render('login', this.getBaseContext(req));
    } catch (error) {
      next(error);
    }
  }
}
