import BaseController from './BaseController.js';
import { cartValidator } from '../../schemas/zod/cart.validator.js';
import { InvalidFieldValueError } from '../../customErrors/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoIdType} MongoIdType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 * @typedef {import('../../types').ServicesType['carts']} CartsServiceType
 * @typedef {import('../../types').ServicesType['users']} UsersServiceType
 * @typedef {import('../../types').ServicesType['tickets']} TicketsServiceType
 * @typedef {import('../../types').ServicesType['products']} ProductsServiceType
 */
export default class CartsController extends BaseController {
  /** @type CartsServiceType */
  #cartsService;
  /** @type UsersServiceType */
  #usersService;
  /** @type TicketsServiceType */
  #ticketsService;
  /** @type ProductsServiceType */
  #productsService;

  /**
   * Constructs a new carts controller
   *
   * @param {{cartsService: CartsServiceType; usersService: UsersServiceType; ticketsService: TicketsServiceType; productsService: ProductsServiceType}} services - Services instances
   */
  constructor({ cartsService, usersService, ticketsService, productsService }) {
    super();
    this.#cartsService = cartsService;
    this.#usersService = usersService;
    this.#ticketsService = ticketsService;
    this.#productsService = productsService;
  }

  /**
   * Adds a product to a cart. If the product exists, it increases its quantity
   *
   * @type ExpressType['RequestHandler']
   */
  addProductToCart = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      let { quantity = 1 } = req.body;
      quantity = Math.abs(Number.parseInt(quantity, 10));
      if (!quantity || Number.isNaN(quantity)) {
        quantity = 1;
      }

      const updatedResponse = await this.#cartsService.addProductToCart(
        cartId,
        productId,
        quantity,
      );

      res.json({
        status: 'updated',
        payload: { cart: updatedResponse },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Adds an array of products to a cart. Pushes the ones which don't exist and increases the quantity of the ones which exist.
   *
   *
   * @type ExpressType['RequestHandler']
   */
  addProductsToCart = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      const updatedResponse = await this.#cartsService.addProductsToCart(
        cartId,
        req.body.products,
      );

      res.json({
        status: 'updated',
        payload: { cart: updatedResponse },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new cart
   *
   * @type ExpressType['RequestHandler']
   */
  create = async (_, res, next) => {
    try {
      const cart = await this.#cartsService.save();

      res.status(201).json({
        status: 'created',
        payload: { cart },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new ticket based on the products of a cart
   *
   * @type ExpressType['RequestHandler']
   */
  createTicket = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      const filteredCart = await this.#cartsService.filterProducts(cartId);

      if (!filteredCart.user) {
        throw new InvalidFieldValueError("Cart doesn't have associated user");
      }
      const { email: purchaser } = await this.#usersService.getById(
        filteredCart.user,
        { throws: true },
      );

      const ticket = await this.#ticketsService.save(purchaser, {
        _id: filteredCart._id,
        filteredProducts: filteredCart.products,
      });

      await filteredCart.products.available.reduce(
        async (prevPromise, availableProduct) => {
          await prevPromise;

          const productFromDb = await this.#productsService.get(
            availableProduct.product,
          );
          await this.#productsService.update(availableProduct.product, {
            stock: productFromDb.stock - availableProduct.quantity,
          });
        },
        Promise.resolve(),
      );

      res.status(201).json({
        status: 'created',
        payload: {
          ticket,
          unavailableProducts: filteredCart.products.unavailable,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Removes a product from a cart
   *
   * @type ExpressType['RequestHandler']
   */
  removeProduct = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      await this.#cartsService.removeProduct(cartId, productId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Removes all products from a cart
   *
   * @type ExpressType['RequestHandler']
   */
  removeProducts = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      await this.#cartsService.removeAllProducts(cartId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Returns data of a single cart
   *
   * @type ExpressType['RequestHandler']
   */
  show = async (req, res, next) => {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      const cart = await this.#cartsService.get(cartId);

      res.json({
        status: 'success',
        payload: { cart },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Changes the quantity of a product in a cart. It is an idempotent operation
   *
   * @type ExpressType['RequestHandler']
   */
  updateProductQuantity = async (req, res, next) => {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      let { quantity = 1 } = req.body;
      quantity = cartValidator.parse({ quantity }).quantity;

      if (Number.isNaN(quantity) || typeof quantity === 'undefined') {
        quantity = 1;
      }

      await this.#cartsService.updateProductQuantity(
        cartId,
        productId,
        quantity,
      );

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
