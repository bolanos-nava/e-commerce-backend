/* eslint-disable class-methods-use-this */
import models from '../../models/index.js';
import BaseController from '../BaseController.js';

import { ParameterError } from '../../customErrors/ParameterError.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ProductType} ProductType
 */

export default class ProductsController extends BaseController {
  /**
   * @type {BaseController['addRoutes']}
   */
  addRoutes(router) {
    this.actions.push(
      ...[
        {
          spec: {
            path: '/',
            method: 'GET',
          },
          actions: this.index,
        },
        {
          spec: {
            path: '/',
            method: 'POST',
          },
          actions: this.create,
        },
        {
          spec: {
            path: '/:productId',
            method: 'GET',
          },
          actions: [this.invalidIdError, this.show],
        },
        {
          spec: {
            path: '/:productId',
            method: 'PUT',
          },
          actions: [this.invalidIdError, this.update],
        },
        {
          spec: {
            path: '/:productId',
            method: 'DELETE',
          },
          actions: [this.invalidIdError, this.delete],
        },
      ],
    );

    this.setupActions(router);
  }

  invalidIdError = (req, res, next) => {
    const { productId } = req.params;

    if (!productId) throw new ParameterError('Id not present in request');
    next();
  };

  /**
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  index = async (req, res, next) => {
    try {
      const { limit } = req.query;
      const products = await models.Product.find({}, {}, { limit });

      res.json({
        status: 'success',
        payload: products,
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
      const { product } = req.body;
      // product.code += randomUUID();

      const newProduct = new models.Product(product);
      await newProduct.productValidator();
      const savedResponse = await newProduct.save();

      // Emitting the new product to the products socket to update the clients in real-time
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
   * @type {ExpressType['RequestHandler']}
   */
  show = async (req, res, next) => {
    try {
      const { productId } = req.params;

      const product = await models.Product.findByIdAndThrow(productId);

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
      const { product: _newData } = req.body;

      const product = await models.Product.findByIdAndThrow(productId);
      const newProduct = Object.assign(product, _newData);
      await newProduct.productValidator(true);
      const savedResponse = await newProduct.save();

      res.json({
        status: 'updated',
        payload: savedResponse,
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
      const product = await models.Product.findByIdAndThrow(productId);
      const response = await product.deleteOne();

      res.json({
        status: 'deleted',
        payload: { ...response, deletedProduct: product },
      });
    } catch (error) {
      next(error);
    }
  };
}
