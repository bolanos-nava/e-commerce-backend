import { AttributeError } from '../../customErrors/AttributeError.js';
import { Product } from '../../models/index.js';
import { ProductRequestSchema } from '../../schemas/zod/productValidator.zod.js';
import BaseController from '../BaseController.js';

/**
 * @typedef {import('../../types').ExpressType} ExpressType
 * @typedef {import('../../types').ProductType} ProductType
 */

export default class ProductsController extends BaseController {
  product = new Product();

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
          actions: this.show,
        },
        {
          spec: {
            path: '/:productId',
            method: 'PUT',
          },
          actions: this.update,
        },
        {
          spec: {
            path: '/:productId',
            method: 'DELETE',
          },
          actions: this.delete,
        },
      ],
    );

    this.setupActions(router);
  }

  /**
   * Returns list of products
   * @type {ExpressType['RequestHandler']}
   */
  index = async (req, res, next) => {
    try {
      const { limit } = req.query;
      let products = await this.product.getProducts();
      //   let products = await req.productsManager.getProducts();
      if (limit && !Number.isNaN(limit)) {
        const limt = Number(limit);
        products = products.slice(0, limt);
      }
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
      const { product: reqProduct } = req.body;
      // product.code += randomUUID();

      const product = ProductRequestSchema.parse({
        ...reqProduct,
        status: true,
      });

      const newProduct = await this.product.createProduct(product);

      // Emitting the new product to the products socket
      req.socketServer.emit('new_product', newProduct);

      res.status(201).json({
        status: 'created',
        payload: newProduct,
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
      const product = await this.product.getProductById(productId);

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

      const newData = ProductRequestSchema.partial().parse(_newData);
      const updatedProduct = await this.product.updateProduct(
        productId,
        newData,
      );

      res.json({
        status: 'updated',
        payload: updatedProduct,
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
      const deletedProduct = await this.product.deleteProduct(productId);
      res.json({
        status: 'deleted',
        payload: deletedProduct,
      });
    } catch (error) {
      next(error);
    }
  };
}
