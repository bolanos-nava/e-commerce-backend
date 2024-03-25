'use strict';

import crypto from 'node:crypto';
import { ObjectFileMapper } from './baseClasses/index.js';
import {
  AttributeError,
  DuplicateResourceError,
} from './customErrors/index.js';

class ProductManager extends ObjectFileMapper {
  /**
   * Shape of product object
   * @type {Product}
   */
  #baseProduct = {
    id: null,
    title: null,
    description: null,
    price: null,
    thumbnail: null,
    code: null,
    stock: null,
  };

  constructor() {
    super('./products.json', 'Product');
  }

  /**
   * Adds a new product
   * @param {Product} _product
   * @returns If the product was saved
   */
  async addProduct(_product) {
    const products = await this.getProducts();

    /** @type {Product} */
    const newProduct = {
      ...this.#baseProduct,
      ..._product,
      id: products[products.length - 1].id + 1,
    };

    if (
      Object.values(newProduct).some(
        (prop) => prop === null || typeof prop === 'undefined',
      )
    ) {
      throw new AttributeError('Missing attributes');
    }

    const codeAlreadyExists = products.some(
      (product) => product.code === newProduct.code,
    );
    if (codeAlreadyExists) {
      throw new DuplicateResourceError(
        `Producto con código ${newProduct.code} ya existe.`,
      );
    }

    products.push(newProduct);
    return await this.save(products);
  }

  /**
   * Returns the list of products
   * @returns {Promise<Product[]>} List of products
   */
  async getProducts() {
    return await this.fetchAll();
  }

  /**
   * Returns the data of a product
   * @param {number} id Id of the product to fetch
   * @returns {Promise<Product>}
   */
  async getProductById(id) {
    return await this.fetchOne(id);
  }

  /**
   * Deletes a product
   * @param {number} id Id of the product to delete
   * @returns {Promise<Product>} The deleted product
   */
  async deleteProduct(id) {
    return await this.deleteOne(id);
  }

  /**
   * Updates a product
   * @param {number} id
   * @param {Promise<Partial<Product>>} newData
   * @returns {Promise<Product>} The updated product
   */
  async updateProduct(id, newData) {
    return await this.updateOne(id, newData);
  }
}

async function main() {
  const productManager = new ProductManager();
  console.log('Productos:', await productManager.getProducts());

  console.log('Añadiendo un producto');
  try {
    await productManager.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    });
  } catch (error) {
    console.error('Error añadiendo producto', error);
  }

  console.log('Añadiendo nuevo producto');
  try {
    await productManager.addProduct({
      title: 'Nuevo producto',
      description: 'Otro producto',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'new-prod-1',
      stock: 25,
    });
  } catch (error) {
    console.error('Error añadiendo producto', error);
  }

  console.log('Añadiendo producto sin falla');
  try {
    for (let i = 1; i <= 7; i++) {
      await productManager.addProduct({
        title: `Diferente producto ${i}`,
        description: 'Este no falla porque su código es un UUUID',
        price: crypto.randomInt(1000),
        thumbnail: 'Sin imagen',
        code: crypto.randomUUID(),
        stock: crypto.randomInt(40),
      });
    }
  } catch (error) {
    console.error('Error añadiendo producto', error);
  }

  console.log('Añadiendo el mismo producto de nuevo...');
  try {
    await productManager.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    });
  } catch (e) {
    console.error(e);
  }

  console.log('Añadiendo producto sin llenar todos los atributos...');
  try {
    await productManager.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: crypto.randomInt(500),
    });
  } catch (e) {
    console.error(e);
  }

  console.log('Buscando el producto con id 1...');
  try {
    console.log('Un producto', await productManager.getProductById(1));
  } catch (e) {
    console.error(e);
  }

  console.log('Buscando producto con id 19...');
  try {
    console.log('Un producto', await productManager.getProductById(19));
  } catch (e) {
    console.error(e);
  }

  console.log(
    'Obteniendo todos los productos antes de borrar y actualizar',
    await productManager.getProducts(),
  );

  try {
    console.log('Producto borrado', await productManager.deleteProduct(6));
  } catch (error) {
    console.error('No se pudo borrar producto por la siguiente razón: ', error);
  }

  try {
    console.log(
      'Producto actualizado',
      await productManager.updateProduct(4, {
        title: 'Producto actualizado',
        price: 600000,
      }),
    );
  } catch (error) {
    console.error(
      'No se pudo actualizar producto por la siguiente razón: ',
      error,
    );
  }

  console.log(
    'Obteniendo productos después de borrar y actualizar',
    await productManager.getProducts(),
  );
}

main();
