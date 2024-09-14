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
  currentSession(req, res, next) {
    try {
      res.json({ status: 'success', payload: { user: req.user } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login process of a user.
   * - If the client has an anonymous cart adds its products to the cart of the user and deletes the anonymous cart
   * - Generates JWT and sends it as cookie
   *
   * @type {ExpressType['RequestHandler']}
   */
  async login(req, res, next) {
    try {
      const anonymousCartId = req?.query?.cart;
      const userCartId = req?.user?.cart;

      // Merging anonymous cart with the cart of the registered user
      if (anonymousCartId) {
        req.requestLogger.debug(
          `Merging anon cart (${anonymousCartId}) with cart ${userCartId}`,
        );
        const { products: prodsOfAnonCart } = await this.#cartsService.get(
          anonymousCartId,
          { populated: false },
        );
        await this.#cartsService.addProductsToCart(userCartId, prodsOfAnonCart);
        await this.#cartsService.delete(anonymousCartId);
      }

      this.#generateTokenAndSaveToCookie(req.user, res, req.logger);
      res.json({
        status: 'success',
        payload: { user: req.user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generates JWT after logging in with GitHub
   *
   * @type ExpressType['RequestHandler']
   */
  loginGitHub(req, res, next) {
    try {
      this.#generateTokenAndSaveToCookie(req.user, res);
      res.redirect('/?logged=true');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logs out, clears the token from the client
   *
   * @type {ExpressType['RequestHandler']}
   */
  logout(_, res, next) {
    try {
      res.clearCookie('token').status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generates JWT and adds cookie to response object
   *
   * @param user - User from request object
   * @param res - Response object
   */
  #generateTokenAndSaveToCookie(user, res, logger) {
    logger.debug('Generating JWT for a user', {
      function: `${SessionsController.name}#${this.#generateTokenAndSaveToCookie.name}`,
    });
    const jwt = this.#jwtTokenFactory.generateToken({
      user: new UserDto(user),
    });
    // TODO: prefer jwt expiration over cookie expiration. This will allow us to know if the user was logged before the token expired, and show error messages based on that
    res.cookie('token', jwt, {
      maxAge: 1000 * 60 * 60 * 24 * 1,
      // maxAge: 1000 * 2,
      httpOnly: true,
    });
    return jwt;
  }
}
