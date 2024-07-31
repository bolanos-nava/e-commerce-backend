import BaseController from './BaseController.js';
import { productValidator } from '../../schemas/zod/product.validator.js';
import { env } from '../../configs/index.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ServicesType['products']} ProductsServiceType
 */

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
   * @type {ExpressType['RequestHandlerWS']}
   */
  create = async (req, res, next) => {
    const { WS_INTERNAL_HOST, USE_BUILT_IN_WS } = env;
    try {
      const { product: request } = req.body;
      const validProduct = productValidator.parse(request);
      const product = await this.#productsService.save(validProduct);

      req.logger.info('Emitting new_product event to websocket server');
      if (USE_BUILT_IN_WS) {
        req.socketServer.emit('new_product', savedResponse);
      } else {
        fetch(WS_INTERNAL_HOST, {
          method: 'POST',
          body: JSON.stringify({
            event: 'new_product',
            payload: savedResponse,
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
  };

  /**
   * Deletes a single product
   * @type {ExpressType['RequestHandler']}
   */
  delete = async (req, res, next) => {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });
      await this.#productsService.delete(productId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  list = async (req, res, next) => {
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
      req.logger.http('GET /products end');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Returns data of a single product
   *
   * @type {ExpressType['RequestHandler']}
   */
  show = async (req, res, next) => {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });

      const product = await this.#productsService.get(productId);

      res.json({
        status: 'success',
        payload: product,
      });
      req.logger.http('GET /products/:productId end');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates a single product
   * @type {ExpressType['RequestHandler']}
   */
  update = async (req, res, next) => {
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
  };
}
