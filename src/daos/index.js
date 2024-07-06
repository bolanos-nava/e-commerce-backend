// export * from './mongo/models/index.js';
import { env } from '../configs/index.js';
import DaoFactory from './DaoFactory.js';

const daos = await new DaoFactory(env.PERSISTENCE).getDaos();

export { DaoFactory, daos };
