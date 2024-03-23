'use strict';

import fs from 'node:fs/promises';
import { ParameterError, ResourceNotFound } from '../customErrors/index.js';
import { capitalize } from '../utils/index.js';

export class ObjectFileMapper {
  /**
   * Specifies path of the file
   */
  path = '';
  resourceName;
  resources = [];

  constructor(path, resourceName) {
    if (!path) {
      throw new ParameterError(
        'path parameter should not be empty. You should specify the path of the file to read/write.',
      );
    }
    if (!resourceName) {
      throw new ParameterError('You should specify the name of the resource.');
    }
    this.path = path;
    this.resourceName = resourceName;
  }

  /**
   * Reads JSON file and parses it. In the case of not receiving a valid JSON,
   * returns an empty array
   * @returns {Promise<ObjectType[] | any>}
   */
  async #getFileAsObject() {
    try {
      const fileRead = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(fileRead);
    } catch {
      return [];
    }
  }

  /**
   * Converts object to JSON and writes it to the file, wiping existing content.
   * @param {ObjectType} data
   */
  async #writeToFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, '\t'), 'utf-8');
    } catch (error) {
      throw error;
    }
  }

  async #findById(id, resources) {
    const foundResource = resources.find((element) => element.id === id);

    if (!foundResource) {
      let errorMessage;
    }
  }

  /**
   * Returns all resources in the file
   * @returns {Promise<ObjectType[]>}
   */
  async all() {
    const objectFile = await this.#getFileAsObject();
    if (Array.isArray(objectFile)) return objectFile;
    return [];
  }

  /**
   * Returns the resource with matching id
   * @param {number} id
   * @returns {Proimse<ObjectType>}
   */
  async find(id) {
    // Throw error if id is undefined
    if (!id) throw new ParameterError('Invalid id');

    const allResources = await this.all();

    // Defines error to throw in case of failure

    const foundResource = allResources.find((element) => element.id === id);

    if (!foundResource) {
      let errorMessage;
      if (this.resourceName) {
        errorMessage = `${capitalize(
          this.resourceName,
        )} with id ${id} not found`;
      }
      throw new ResourceNotFound(errorMessage);
    }

    return foundResource;
  }

  /**
   * Saves data to file
   * @param {ObjectType} data
   * @returns {Promise<boolean>} True if file was saved, otherwise, return false
   */
  async save(data) {
    try {
      await this.#writeToFile(data);
      return true;
    } catch {
      return false;
    }
  }

  async delete(id) {
    const allResources = await this.all();
  }
}
