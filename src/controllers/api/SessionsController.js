import UserDto from '../../entities/UserDto.js';
import BaseController from './BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').JwtTokenFactoryType} JwtTokenFactoryType
 * @typedef {import('../../types').ServicesType['carts']} CartsServiceType
 */

export default class SessionsController extends BaseController {
  /** @type JwtTokenFactoryType */
  #jwtTokenFactory;
  /** @type CartsServiceType */
  #cartsService;

  /**
   * Constructs a new sessions controller instance
   *
   * @param {JwtTokenFactoryType} jwtTokenFactory
   * @param {CartsServiceType} cartsService
   */
  constructor(jwtTokenFactory, cartsService) {
    super();
    this.#jwtTokenFactory = jwtTokenFactory;
    this.#cartsService = cartsService;
  }

  /**
   * Returns data about current session
   *
   * @type ExpressType['RequestHandler']
   */
  currentSession = async (req, res, next) => {
    try {
      res.json({ status: 'success', payload: { user: req.user.user } });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generates JWT and sends it to the client
   *
   * @type {ExpressType['RequestHandler']}
   */
  login = async (req, res, next) => {
    try {
      const { cart: anonymousCartId } = req.query;
      const { cart: userCartId } = req.user;

      if (anonymousCartId) {
        const { products: prodsOfAnonCart } = await this.#cartsService.get(
          anonymousCartId,
          {
            populated: false,
          },
        );
        await this.#cartsService.addProductsToCart(userCartId, prodsOfAnonCart);
        await this.#cartsService.delete(anonymousCartId);
      }

      this.#generateTokenAndSaveToCookie(req.user, res);
      res.status(204).send();
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
      this.#generateTokenAndSaveToCookie(req.user, res);
      res.redirect('/?logged=true');
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

  /**
   * Generates JWT and adds cookie to response object
   *
   * @param user - User from request object
   * @param res - Response object
   */
  #generateTokenAndSaveToCookie = (user, res) => {
    const jwt = this.#jwtTokenFactory.generateToken({
      user: new UserDto(user),
    });
    res.cookie('token', jwt, {
      maxAge: 1000 * 60 * 60 * 24 * 1,
      httpOnly: true,
    });
    return jwt;
  };
}
