export default class SessionViewsController {
  renderRegisterView(_, res, next) {
    try {
      res.render('register');
    } catch (error) {
      next(error);
    }
  }

  renderLoginView(_, res, next) {
    try {
      res.render('login');
    } catch (error) {
      next(error);
    }
  }
}
