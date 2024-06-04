import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class SessionsController extends BaseController {
  /**
   * Redirects to homepage after logging in
   * @type {ExpressType['RequestHandler']}
   */
  login = async (req, res) => {
    res.redirect('/');
  };

  /**
   *
   * @type {ExpressType['RequestHandler']}
   */
  loginGitHub = async (req, res) => {
    console.log(req.user);
    req.session.user = req.user;
    res.redirect('/');
  };

  /**
   * Destroys a session
   * @type {ExpressType['RequestHandler']}
   */
  logout = async (req, res, next) => {
    req.session.destroy((error) => {
      if (error) return next(error);
      return res.status(204).end(); // no content
    });
  };
}
