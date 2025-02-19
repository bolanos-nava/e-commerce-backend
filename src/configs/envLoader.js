import os from 'node:os';
import path from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import logger from './logger.js';

const { MONGO_TYPE } = process.env;
const MONGO_TYPES = {
  LOCAL: 'local',
  ATLAS: 'atlas',
};

logger.debug('were in this pod:', os.hostname());

const envFileExists = readdirSync(path.resolve()).some((filename) =>
  filename.startsWith('.env'),
);

// In case there .env files, run this. When won't there be .env files? When deploying on a Docker container or on a Kubernetes cluster because in those cases env variables are passed directly
if (envFileExists) {
  const { default: dotenv } = await import('dotenv');
  const envPath = (() => {
    const baseEnv = path.join(path.resolve(), '.env');
    if (!MONGO_TYPE || MONGO_TYPE === MONGO_TYPES.LOCAL) return baseEnv;

    const filePath = `${baseEnv}.${MONGO_TYPE}`.toLowerCase();
    return existsSync(filePath) ? filePath : baseEnv;
  })();
  logger.info(`Loaded environment variables from ${envPath} file.`);
  // Loads vars in .env into process.env
  dotenv.config({ path: envPath });
}

if (typeof process.env.DB_REPLICA_SET_NAME !== 'undefined') {
  const { default: resolveDns } = await import('./discoverReplicaSet.js');
  try {
    const replicaSetAddress = await resolveDns();
    process.env.DB_URI = `mongodb://${replicaSetAddress}/${process.env.DB_NAME}?replicaSet=${process.env.DB_REPLICA_SET_NAME}`;
  } catch (error) {
    logger.fatal(`Error discovering replica set: ${error.message}`);
    process.exit(1);
  }
}

const DB_URI =
  process.env.DB_URI ??
  `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const WS_CLIENT_HOST =
  process.env.WS_CLIENT_HOST ?? `localhost:${process.env.SERVER_PORT}`;

// default values
const env = {
  NODE_ENV: 'dev',
  API_URL: 'http://localhost',
  SERVER_PORT: 8080,
  MONGO_TYPE: MONGO_TYPES.LOCAL,
  DB_URI: DB_URI ?? 'mongodb://localhost:27017',
  DB_NAME: 'ecommerce',
  JWT_PRIVATE_KEY: '',
  PERSISTENCE: 'MONGO',
  USE_BUILT_IN_WS: false,
  WS_CLIENT_HOST: WS_CLIENT_HOST ?? 'localhost:8080',
  WS_CLIENT_PATH: '/socket.io',
  WS_INTERNAL_HOST: 'localhost',
  GMAIL_USER: '',
  GMAIL_APP_KEY: '',
};

Object.keys(env).forEach((envKey) => {
  const valueFromEnvFile = process.env[envKey];
  if (typeof valueFromEnvFile !== 'undefined') env[envKey] = valueFromEnvFile;
});

const envsToLog = [
  'NODE_ENV',
  'SERVER_PORT',
  'MONGO_TYPE',
  'DB_NAME',
  'USE_BUILT_IN_WS',
].reduce((map, key) => {
  // eslint-disable-next-line no-param-reassign
  map[key] = env[key];
  return map;
}, {});
logger.debug(envsToLog);

export default env;
