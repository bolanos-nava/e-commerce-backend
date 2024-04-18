import path from 'node:path';
import { ProductsManager } from '../../models/index.js';
import BaseController from '../BaseController.js';

export default class ProductsController extends BaseController {
  productsManager = new ProductsManager(`${path.resolve()}/src/products.json`);

  /**
   * Returns list of products
   */
  async index(req, res, next) {
    try {
      const { limit } = req.query;
      let products = await this.productsManager.getProducts();
      //   let products = await req.productsManager.getProducts();
      if (limit && !Number.isNaN(limit)) {
        const limt = Number(limit);
        products = products.slice(0, limt);
      }
      res.send({
        status: 'success',
        payload: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new product
   */
  async create(req, res, next) {
    try {
      const { product } = req.body;
      // product.code += randomUUID();
      const newProduct = await this.productsManager.createProduct(product);

      // Emitting the new product to the products socket
      const { socketServer } = req;
      socketServer.emit('new_product', newProduct);

      res.status(201).send({
        status: 'created',
        payload: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns data of a single product
   */
  async show(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await this.productsManager.getProductById(productId);
      res.send({
        status: 'success',
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a single product
   */
  async update(req, res, next) {
    try {
      const { productId } = req.params;
      const { product: newData } = req.body;
      const updatedProduct = await this.productsManager.updateProduct(
        productId,
        newData,
      );
      res.send({
        status: 'updated',
        payload: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a single product
   */
  async delete(req, res, next) {
    try {
      const { productId } = req.params;
      const deletedProduct =
        await this.productsManager.deleteProduct(productId);
      res.send({
        status: 'deleted',
        payload: deletedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  addRoutes(router) {
    this.actions.push(
      ...[
        {
          spec: {
            path: '/',
            method: 'GET',
          },
          action: this.index.bind(this),
        },
        {
          spec: {
            path: '/',
            method: 'POST',
          },
          action: this.create.bind(this),
        },
        {
          spec: {
            path: '/:productId',
            method: 'GET',
          },
          action: this.show.bind(this),
        },
        {
          spec: {
            path: '/:productId',
            method: 'PUT',
          },
          action: this.update.bind(this),
        },
        {
          spec: {
            path: '/:productId',
            method: 'DELETE',
          },
          action: this.delete.bind(this),
        },
      ],
    );

    this.setupActions(router);
  }
}
