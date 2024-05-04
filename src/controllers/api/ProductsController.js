/* eslint-disable class-methods-use-this */
import { Product } from '../../daos/index.js';
import BaseController from './BaseController.js';

import { ParameterError } from '../../customErrors/ParameterError.js';
import { productValidator } from '../../schemas/zod/product.validator.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ProductType} ProductType
 * @typedef {import('../../types').ControllerRoute} ControllerRoute
 */

export default class ProductsController extends BaseController {
  /** @type {ControllerRoute[]} */
  routes = [
    {
      path: '/',
      httpMethod: 'GET',
      actions: this.index.bind(this),
    },
    {
      path: '/',
      httpMethod: 'POST',
      actions: this.create.bind(this),
    },
    {
      path: '/:productId',
      httpMethod: 'GET',
      actions: [this.invalidIdError.bind(this), this.show.bind(this)],
    },
    {
      path: '/:productId',
      httpMethod: 'PUT',
      actions: [this.invalidIdError.bind(this), this.update.bind(this)],
    },
    {
      path: '/:productId',
      httpMethod: 'DELETE',
      actions: [this.invalidIdError.bind(this), this.delete.bind(this)],
    },
  ];

  invalidIdError(req, res, next) {
    const { productId } = req.params;

    if (!productId) throw new ParameterError('Id not present in request');
    next();
  }

  /**
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  async index(req, res, next) {
    try {
      const { limit } = req.query;
      const products = await Product.find({}, {}, { limit });

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
  async create(req, res, next) {
    try {
      const { product: request } = req.body;
      const validRequest = productValidator.parse(request);
      const product = new Product(validRequest);
      const savedResponse = await product.save();

      // Emitting the new product to the products socket to update the clients in real-time
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
  async show(req, res, next) {
    try {
      const { productId } = req.params;

      const product = await Product.findByIdAndThrow(productId);

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
  async update(req, res, next) {
    try {
      const { productId } = req.params;
      const { product: request } = req.body;
      const newData = productValidator.partial().parse(request);

      const product = await Product.findByIdAndThrow(productId);
      const newProduct = Object.assign(product, newData);
      const updatedResponse = await newProduct.save();

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
  async delete(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await Product.findByIdAndThrow(productId);
      const response = await product.deleteOne();

      res.json({
        status: 'deleted',
        payload: { ...response, deletedProduct: product },
      });
    } catch (error) {
      next(error);
    }
  }
}
