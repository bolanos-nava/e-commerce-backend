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

  async addProduct(_product) {
    const products = await this.all();

    const newProduct = {
      ...this.#baseProduct,
      ..._product,
      id: products.length + 1,
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

    // this.products.push(newProduct);
    products.push(newProduct);
    return await this.save(products);
  }

  async getProducts() {
    return await this.all();
  }

  async getProductById(id) {
    return await this.find(id);
  }
}

async function main() {
  const product = new ProductManager();
  console.log('Productos:', await product.getProducts());

  console.log('Añadiendo un producto');
  try {
    await product.addProduct({
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
    await product.addProduct({
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
    await product.addProduct({
      title: 'Diferente producto',
      description: 'Este no falla porque su código es un UUUID',
      price: crypto.randomInt(1000),
      thumbnail: 'Sin imagen',
      code: crypto.randomUUID(),
      stock: crypto.randomInt(40),
    });
  } catch (error) {
    console.error('Error añadiendo producto', error);
  }

  console.log('Añadiendo el mismo producto de nuevo...');
  try {
    await product.addProduct({
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
    await product.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: crypto.randomInt(500),
    });
  } catch (e) {
    console.error(e);
  }

  console.log('Buscando el producto con id 1...');
  try {
    console.log('Un producto', await product.getProductById(1));
  } catch (e) {
    console.error(e);
  }

  console.log('Buscando producto con id 19...');
  try {
    console.log('Un producto', await product.getProductById(19));
  } catch (e) {
    console.error(e);
  }

  console.log('Obteniendo todos los productos', await product.getProducts());
}

main();
