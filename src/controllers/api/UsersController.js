import { userValidator } from '../../schemas/zod/user.validator.js';
import services from '../../services/index.js';
import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class UsersController extends BaseController {
  /**
   * Creates a new user
   * @type {ExpressType['RequestHandler']}
   */
  createUser = async (req, res, next) => {
    try {
      const user = userValidator.parse(req.body);

      await services.users.saveNewUser(user);

      // Redirect to login page
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      // TODO: show error message in frontend
      res.redirect('/register?error=Bad_Form');
    }
  };
}
