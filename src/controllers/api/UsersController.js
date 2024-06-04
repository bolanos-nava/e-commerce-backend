import { userValidator } from '../../schemas/zod/user.validator.js';
import services from '../../services/index.js';
import BaseController from './BaseController.js';
import { encryptPassword } from '../../utils/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class UsersController extends BaseController {
  /**
   * Registers a new user
   * @type {ExpressType['RequestHandler']}
   */
  registerUser = async (req, res, next) => {
    try {
      const user = userValidator.parse(req.body);

      user.password = encryptPassword(user.password);
      await services.users.saveNewUser(user);

      // Redirect to login page
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      // TODO: show error message in frontend, below the corresponding inputs
      res.redirect('/register?error=bad_form');
    }
  };

  registerUserP = async (req, res, next) => {
    console.log(req.session);
    res.redirect('/login');
  };
}
