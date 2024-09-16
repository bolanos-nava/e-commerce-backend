import BaseController from './BaseController.js';
import { productValidator } from '../../schemas/zod/product.validator.js';
import { env } from '../../configs/index.js';
import { ForbiddenError } from '../../customErrors/index.js';
import UserDto from '../../entities/UserDto.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ServicesType['products']} ProductsServiceType
 */

const TEMPLATE_PRODUCT_DELETED = (args) => `
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
    Te informamos que tu producto con id <strong>${args.id}</strong> se ha
    eliminado de CoderStore.
  </p>

  <p>A continuación, te dejamos un resumen del producto:</p>
  <ul>
    <li>Título: ${args.title}</li>
    <li>Descripción: ${args.description}</li>
  </ul>

  <p>
    Atentamente,
    <br />
    <em>CoderStore Communications Team</em>
  </p>
`;

export default class ProductsController extends BaseController {
  /** @type ProductsServiceType */
  #productsService;

  /**
   * Constructs a new products controller
   *
   * @param {ProductsServiceType} productsService - Products service instance
   */
  constructor(productsService) {
    super();
    this.#productsService = productsService;
  }

  /**
   * Creates a new product
   *
   * @type {ExpressType['RequestHandlerWS']}
   */
  async create(req, res, next) {
    const { WS_INTERNAL_HOST, USE_BUILT_IN_WS } = env;
    try {
      req.requestLogger.debug('Creating new product', { body: req.body });
      const { product: request } = req.body;
      request.createdBy = req.user._id;
      req.requestLogger.debug(`Product created by: ${req.user._id}`);
      const validProduct = productValidator.parse(request);
      const { product } = await this.#productsService.save(validProduct);

      req.logger.debug('Emitting new_product event to websocket server');
      if (USE_BUILT_IN_WS) {
        req.socketServer.emit('new_product', product);
      } else {
        fetch(WS_INTERNAL_HOST, {
          method: 'POST',
          body: JSON.stringify({
            event: 'new_product',
            payload: product,
          }),
          headers: { 'Content-Type': 'application/json' },
        }).then((response) =>
          req.logger.http(
            `Websocket service responded with status ${response.status}`,
          ),
        );
      }

      res.status(201).json({
        status: 'created',
        payload: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a single product
   *
   * @type {ExpressType['RequestHandler']}
   */
  async delete(req, res, next) {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });
      const { role: currentUserRole, _id: currentUserId } = req.user;

      const { product } = await this.#productsService.get(productId, {
        populated: true,
      });
      if (product.createdBy === null) {
        if (currentUserRole !== 'admin')
          throw new ForbiddenError(
            'You are not authorized to delete this product',
          );
        await this.#productsService.delete(productId);
        return res.status(204).send();
      }

      const productUser = new UserDto(product.createdBy);
      if (
        currentUserRole === 'admin' ||
        (currentUserRole === 'user_premium' &&
          productUser._id === currentUserId)
      ) {
        await this.#productsService.delete(productId);
      } else {
        throw new ForbiddenError(
          'You are not authorized to delete this product',
        );
      }

      if (productUser.role === 'user_premium') {
        const templateFull = TEMPLATE_PRODUCT_DELETED({
          to_name: productUser.fullName,
          id: product.id,
          title: product.title,
          description: product.description,
        });

        req.transport
          .sendMail({
            from: `CoderStore Communications <noreply@coderstore.com>`,
            to: productUser.email,
            subject: 'Tu producto ha sido eliminado',
            html: templateFull,
          })
          .then(() => {
            req.requestLogger.info(
              `Deleted product successfully, sent email to ${productUser.email}`,
            );
          });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  async list(req, res, next) {
    try {
      const { limit, page, sort, minPrice, maxPrice, categoryId, minStock } =
        req.query;
      const response = await this.#productsService.getAll(
        {
          minPrice,
          maxPrice,
          categoryId,
          minStock,
        },
        {
          limit,
          page,
          sort,
        },
      );

      res.json({
        status: 'success',
        payload: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns data of a single product
   *
   * @type {ExpressType['RequestHandler']}
   */
  async show(req, res, next) {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });

      const { product } = await this.#productsService.get(productId);

      res.json({
        status: 'success',
        payload: product,
      });
      req.logger.http('GET /products/:productId end');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a single product
   *
   * @type {ExpressType['RequestHandler']}
   */
  async update(req, res, next) {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });
      const newData = productValidator.partial().parse(req.body.product);

      const updatedProduct = await this.#productsService.update(
        productId,
        newData,
      );

      res.json({
        status: 'updated',
        payload: { product: updatedProduct },
      });
    } catch (error) {
      next(error);
    }
  }
}
