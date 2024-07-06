import BaseController from './BaseController.js';
import { productValidator } from '../../schemas/zod/product.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').MongoDaosType['products']} ProductsDao
 */

export default class ProductsController extends BaseController {
  /** @type ProductsDao */
  #productsService;

  /**
   * Constructs a new products controller
   *
   * @param {ProductsDao} productsService - Products service instance
   */
  constructor(productsService) {
    super();
    this.#productsService = productsService;
  }

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
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new product
   * @type {ExpressType['RequestHandlerWS']}
   */
  create = async (req, res, next) => {
    try {
      const { product: request } = req.body;
      const validProduct = productValidator.parse(request);
      const savedResponse = await this.#productsService.save(validProduct);

      req.socketServer.emit('new_product', savedResponse);

      res.status(201).json({
        status: 'created',
        payload: savedResponse,
      });
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

      const updatedResponse = await this.#productsService.update(
        productId,
        newData,
      );

      res.json({
        status: 'updated',
        payload: updatedResponse,
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
}
