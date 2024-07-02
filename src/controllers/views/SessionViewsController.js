export default class SessionViewsController {
  async renderRegisterView(req, res, next) {
    try {
      res.render('register');
    } catch (error) {
      next(error);
    }
  }

  async renderLoginView(req, res, next) {
    try {
      res.render('login');
    } catch (error) {
      next(error);
    }
  }
}
