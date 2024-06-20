import BaseController from './BaseController.js';

import { productValidator } from '../../schemas/zod/product.validator.js';

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
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  listProducts = async (req, res, next) => {
    try {
      const { limit, page, sort, ...filter } = req.query;
      const response = await this.#productsService.getProducts(filter, {
        limit,
        page,
        sort,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new product
   * @type {ExpressType['RequestHandlerWS']}
   */
  createProduct = async (req, res, next) => {
    try {
      const { product: request } = req.body;
      const validRequest = productValidator.parse(request);
      const savedResponse =
        await this.#productsService.saveProduct(validRequest);

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
  showProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });

      const product = await this.#productsService.getProductById(productId);

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
  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });
      const { product: request } = req.body;
      const newData = productValidator.partial().parse(request);

      const updatedResponse = await this.#productsService.updateProductById(
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
  deleteProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      this.validateIds({ productId });
      await this.#productsService.deleteProductById(productId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
