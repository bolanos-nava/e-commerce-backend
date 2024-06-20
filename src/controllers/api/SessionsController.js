import { UnauthorizedError } from '../../customErrors/UnauthorizedError.js';
import services from '../../services/index.js';
import { isValidPassword, JwtTokenFactory } from '../../utils/index.js';
import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 */

export default class SessionsController extends BaseController {
  /** * @type {JwtTokenFactory} */
  #jwtTokenFactory;

  /**
   * Constructs a new sessions controller instance
   *
   * @param {JwtTokenFactory} jwtTokenFactory
   */
  constructor(jwtTokenFactory) {
    super();
    this.#jwtTokenFactory = jwtTokenFactory;
  }

  /**
   * Redirects to homepage after logging in
   *
   * @type {ExpressType['RequestHandler']}
   */
  login = async (req, res) => {
    res.redirect('/');
  };

  /**
   * Callback after login with GitHub
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
   *
   * @type {ExpressType['RequestHandler']}
   */
  logout = async (req, res, next) => {
    req.session.destroy((error) => {
      if (error) return next(error);
      return res.status(204).end(); // no content
    });
  };

  /**
   * Login with JWT
   *
   * @type {ExpressType['RequestHandler']}
   */
  jwtLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await services.users.getUserByEmail(email);
      if (!user || !isValidPassword(password, user.password)) {
        throw new UnauthorizedError('Invalid credentials provided');
      }
      const jwt = this.#jwtTokenFactory.generateToken({
        user: {
          _id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
      res
        .cookie('jwt', jwt, {
          maxAge: 1000 * 60 * 15, // base unit of maxAge is ms
          httpOnly: true,
          signed: true,
        })
        .status(204)
        .send();
      // res.send({
      //   status: 'success',
      //   payload: { jwt },
      // });
    } catch (error) {
      next(error);
    }
  };
}
