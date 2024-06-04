import { ForbiddenError } from '../../customErrors/index.js';
import { sessionValidator } from '../../schemas/zod/index.js';
import services from '../../services/index.js';
import { isValidPassword } from '../../utils/passwordEncryption.js';
import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class SessionsController extends BaseController {
  /**
   * Creates a new user
   * @type {ExpressType['RequestHandler']}
   */
  login = async (req, res) => {
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
