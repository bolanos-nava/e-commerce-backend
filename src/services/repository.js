import { env } from '../configs/index.js';
import mongoServicesFactory from './mongoServicesFactory.js';

const PERSISTENCE_TYPES = {
  MONGO: mongoServicesFactory,
};

/**
 * Object to interchange services according to the selected persistence
 *
 * @type {import('../types').RepositoryType} RepositoryType
 */
const repository = PERSISTENCE_TYPES[env.PERSISTENCE];

export default repository;
