/* eslint-disable class-methods-use-this */
import services from '../../services/index.js';
import BaseController from './BaseController.js';

import { ParameterError } from '../../customErrors/ParameterError.js';
import { productValidator } from '../../schemas/zod/product.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ProductType} ProductType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */

export default class ProductsController extends BaseController {
  invalidIdError(req, res, next) {
    const { productId } = req.params;

    if (!productId) throw new ParameterError('Id not present in request');
    next();
  }

  /**
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  async listProducts(req, res, next) {
    try {
      const { limit } = req.query;
      const products = await services.products.getProducts(limit);

      res.json({
        status: 'success',
        payload: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new product
   * @type {ExpressType['RequestHandlerWS']}
   */
  async createProduct(req, res, next) {
    try {
      const { product: request } = req.body;
      const validRequest = productValidator.parse(request);
      const savedResponse = await services.products.saveProduct(validRequest);

      req.socketServer.emit('new_product', savedResponse);

      res.status(201).json({
        status: 'created',
        payload: savedResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns data of a single product
   * @type {ExpressType['RequestHandler']}
   */
  async showProduct(req, res, next) {
    try {
      const { productId } = req.params;

      const product = await services.products.getProductById(productId);

      res.json({
        status: 'success',
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a single product
   * @type {ExpressType['RequestHandler']}
   */
  async updateProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const { product: request } = req.body;
      const newData = productValidator.partial().parse(request);

      const updatedResponse = await services.products.updateProductById(
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
  }

  /**
   * Deletes a single product
   * @type {ExpressType['RequestHandler']}
   */
  async deleteProduct(req, res, next) {
    try {
      const { productId } = req.params;
      await services.products.deleteProductById(productId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
