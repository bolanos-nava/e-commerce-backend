// eslint-disable-next-line max-classes-per-file
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

const TEMPLATE_TICKET_SUCCESS = (args) => `
  <h2
    style="
      padding-bottom: 0.2em;
      margin-bottom: 1em;
      border-bottom: 0.1em solid black;
    "
  >
    CoderStore
  </h2>

  <p>Hola ${args.to_name},</p>

  <p>
    Te enviamos un resumen de tu compra con id <strong>${args.id}</strong> en
    CoderStore.
  </p>

  <ul>
    <li>Productos: ${args.quantity}</li>
    <li>Total: $${args.amount}</li>
  </ul>

  <p>
    Atentamente,
    <br />
    <em>CoderStore Communications Team</em>
  </p>
  `;

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
  async addProductToCart(req, res, next) {
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
  }

  /**
   * Adds an array of products to a cart. Pushes the ones which don't exist and increases the quantity of the ones which exist.
   *
   * Endpoint used to merge an anonymous cart to an existing user's cart.
   *
   *
   * @type ExpressType['RequestHandler']
   */
  async addProductsToCart(req, res, next) {
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
  }

  /**
   * Creates a new cart
   *
   * @type ExpressType['RequestHandler']
   */
  async create(_, res, next) {
    try {
      const cart = await this.#cartsService.save();

      res.status(201).json({
        status: 'created',
        payload: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new ticket based on the products of a cart
   *
   * @type ExpressType['RequestHandler']
   */
  async createTicket(req, res, next) {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      const filteredCart = await this.#cartsService.filterProducts(cartId);

      if (!filteredCart.user) {
        throw new InvalidFieldValueError("Cart doesn't have associated user");
      }
      const { user } = await this.#usersService.getById(filteredCart.user, {
        throws: true,
      });
      const purchaser = user.email;

      req.requestLogger.debug(
        `Creating ticket for user with email: ${purchaser}`,
      );

      const { ticket } = await this.#ticketsService.save(
        { purchaser, amount: filteredCart.amount },
        {
          _id: filteredCart._id,
          filteredProducts: filteredCart.products,
        },
      );

      req.requestLogger.debug('Cart', { filteredCart });
      await filteredCart.products.available.reduce(
        async (prevPromise, availableProduct) => {
          await prevPromise;

          const { product: productFromDb } = await this.#productsService.get(
            availableProduct.product,
          );
          await this.#productsService.update(availableProduct.product, {
            stock: productFromDb.stock - availableProduct.quantity,
          });
        },
        Promise.resolve(),
      );

      const templateFull = TEMPLATE_TICKET_SUCCESS({
        to_name: req.user.fullName,
        id: ticket._id,
        quantity: ticket.products.reduce((acc, prod) => acc + prod.quantity, 0),
        amount: ticket.amount.toFixed(2),
      });

      req.transport
        .sendMail({
          from: `CoderStore Communications <noreply@coderstore.com>`,
          to: req.user.email,
          subject: `Resumen de compra #${ticket._id}`,
          html: templateFull,
        })
        .then(() => {
          req.requestLogger.info(
            `Sent purchase confirmation to ${req.user.email}`,
          );
        });

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
  }

  /**
   * Removes a product from a cart
   *
   * @type ExpressType['RequestHandler']
   */
  async removeProduct(req, res, next) {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      await this.#cartsService.removeProduct(cartId, productId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes all products from a cart
   *
   * @type ExpressType['RequestHandler']
   */
  async removeProducts(req, res, next) {
    try {
      const { cartId } = req.params;
      this.validateIds({ cartId });

      await this.#cartsService.removeAllProducts(cartId);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns data of a single cart
   *
   * @type ExpressType['RequestHandler']
   */
  async show(req, res, next) {
    // TODO: add validation of cart ownership
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
  }

  /**
   * Sets the quantity of a product in a cart. It is an idempotent operation
   *
   * @type ExpressType['RequestHandler']
   */
  async setProductQuantity(req, res, next) {
    try {
      const { cartId, productId } = req.params;
      this.validateIds({ cartId }, { productId });

      let { quantity = 1 } = req.body;
      quantity = cartValidator.parse({ quantity }).quantity;

      if (Number.isNaN(quantity) || typeof quantity === 'undefined') {
        quantity = 1;
      }

      await this.#cartsService.setProductQuantity(cartId, productId, quantity);

      // No content
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
