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
    try {
      const credentials = sessionValidator.parse(req.body);

      const user = await services.users.getUserByEmail(credentials.email, {
        throws: true,
      });
      if (!isValidPassword(credentials.password, user.password)) {
        throw new ForbiddenError("Passwords don't match", 403);
      }

      req.session.user = {
        email: credentials.email,
        admin: true,
      };

      res.redirect('/'); // redirect to homepage
    } catch (error) {
      res.redirect('/login?error=bad_credentials');
    }
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

  loginP = async (req, res) => {
    res.redirect('/');
  };
}
