import { env } from '../configs/index.js';
import mongoServicesFactory from './mongoServicesFactory.js';

const PERSISTENCE_TYPES = {
  MONGO: mongoServicesFactory,
};

/**
 * @type {import('../types').RepositoryType} RepositoryType
 */
const repository = PERSISTENCE_TYPES[env.PERSISTENCE];
// const repository = PERSISTENCE_TYPES.MONGO;

export default repository;
