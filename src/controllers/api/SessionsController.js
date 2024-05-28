import { InvalidFieldValueError } from '../../customErrors/InvalidFieldValueError.js';
import { sessionValidator } from '../../schemas/zod/index.js';
import services from '../../services/index.js';
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
      if (user.password !== credentials.password) {
        throw new InvalidFieldValueError("Passwords don't match", 403);
      }

      req.session.user = {
        email: credentials.email,
        admin: true,
      };

      res.redirect('/');
    } catch (error) {
      res.redirect('/login?error=Bad_Credentials');
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
}
