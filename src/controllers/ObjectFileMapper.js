'use strict';

import fs from 'node:fs/promises';
import {
  ParameterError,
  ResourceNotFoundError,
} from '../customErrors/index.js';
import { capitalize } from '../utils/index.js';

/**
 * @typedef {import('./types.d.ts').ObjectType} ObjectType
 */

/**
 * Class to manipulate data in files as JS objects. Allows CRUD operations
 */
export default class ObjectFileMapper {
  /** Specifies path of the file */
  path = '';
  /** Specifies name of the resources */
  resourceName;
  /** Array to save resources */
  resources = [];

  /**
   * Builds a new ObjectFileMapper instance to manage resources and persist them in disk
   * @param {string} path Path of file where resources will be persisted
   * @param {string} resourceName Name of the resource. Used for error messages
   */
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
   * @returns {Promise<ObjectType[] | never[]>}
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
   * Converts object to JSON and writes it to the file,
   * wiping existing content.
   * @param {ObjectType} data Data to write to the file specified by the path parameter of the class
   */
  async #writeToFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, '\t'), 'utf-8');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Helper function to find a resource by its id. If
   * it doesn't exist, then throws error
   * @param {number} id
   * @returns {{foundResource: ObjectType, resourceIdx: number} | never}
   */
  findById(id) {
    // const id = Number(_id);
    // if (isNaN(id)) throw new ParameterError('Id parameter should be a number');
    const resourceIdx = this.resources.findIndex(
      (resource) => resource.id === id,
    );

    if (resourceIdx === -1) {
      let errorMessage;
      if (this.resourceName) {
        errorMessage = `${capitalize(
          this.resourceName,
        )} with id ${id} not found`;
      }
      throw new ResourceNotFoundError(errorMessage);
    }

    return {
      foundResource: this.resources[resourceIdx],
      resourceIdx,
    };
  }

  /**
   * Returns all resources in the file
   * @returns {Promise<ObjectType[]>} Promise that resolves to an array of resources
   */
  async fetchAll() {
    const fileAsObject = await this.#getFileAsObject();
    if (Array.isArray(fileAsObject)) {
      this.resources = fileAsObject;
      return fileAsObject;
    }
    this.resources = [];
    return [];
  }

  /**
   * Returns the resource with matching id
   * @param {number} id Id of the resource to fetch
   * @returns {Promise<ObjectType>} Promise that resolves to the fetched resource
   */
  async fetchOne(id) {
    // Throw error if id is undefined
    if (!id) throw new ParameterError('Invalid id');

    await this.fetchAll();
    return this.findById(id).foundResource;
  }

  /**
   * Saves data to file
   * @param {ObjectType} data The data to save to the file
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

  /**
   * Deletes one resource from the file and overwrites the file
   * without the deleted resource
   * @param {number} id
   * @returns
   */
  async deleteOne(id) {
    const resources = await this.fetchAll();
    const resourceToDelete = this.findById(id).foundResource;

    const newResources = resources.filter((resource) => resource.id !== id);

    await this.save(newResources);

    return resourceToDelete;
  }

  /**
   *
   * @param {number} id
   * @param {ObjectType} newData
   * @returns
   */
  async updateOne(id, newData) {
    const resources = await this.fetchAll();
    const { foundResource, resourceIdx } = this.findById(id);

    resources[resourceIdx] = { ...foundResource, ...newData };

    await this.save(resources);

    return resources[resourceIdx];
  }
}
