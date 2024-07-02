import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').JwtTokenFactoryType} JwtTokenFactoryType
 */

export default class SessionsController extends BaseController {
  /** * @type {JwtTokenFactoryType} */
  #jwtTokenFactory;

  /**
   * Constructs a new sessions controller instance
   *
   * @param {JwtTokenFactoryType} jwtTokenFactory
   */
  constructor(jwtTokenFactory) {
    super();
    this.#jwtTokenFactory = jwtTokenFactory;
  }

  /**
   * Generates JWT and sends it to the client
   *
   * @type {ExpressType['RequestHandler']}
   */
  login = async (req, res, next) => {
    try {
      const { user } = req;
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
        .cookie('token', jwt, {
          maxAge: 1000 * 60 * 15, // base unit of maxAge is ms
          httpOnly: true, // so jwt can't be obtained with js from the client
        })
        .status(204)
        .send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generates JWT after logging in with GitHub
   *
   * @type ExpressType['RequestHandler']
   */
  loginGitHub = async (req, res, next) => {
    try {
      // TODO: transform data from GitHub
      const jwt = this.#jwtTokenFactory.generateToken({
        user: req.user,
      });
      console.log("We're here");
      res
        .cookie('token', jwt, {
          maxAge: 1000 * 60 * 15,
          httpOnly: true,
        })
        .redirect('/?logged=true');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logs out, clears the token from the client
   *
   * @type {ExpressType['RequestHandler']}
   */
  logout = async (req, res, next) => {
    try {
      res.clearCookie('token').status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
