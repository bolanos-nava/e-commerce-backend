import path from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import os from 'node:os';

const { MONGO_DEPLOYMENT } = process.env;
const MONGO_DEPLOYMENTS = {
  LOCAL: 'local',
  ATLAS: 'atlas',
};

console.log('were in this pod:', os.hostname());

const envFileExists = readdirSync(path.resolve()).some((filename) =>
  filename.startsWith('.env'),
);

// In case there .env files, run this. When won't there be .env files? When deploying on a Docker container or on a Kubernetes cluster because in those cases env variables are passed directly
if (envFileExists) {
  const { default: dotenv } = await import('dotenv');
  const envPath = (() => {
    const baseEnv = path.join(path.resolve(), '.env');
    if (!MONGO_DEPLOYMENT || MONGO_DEPLOYMENT === MONGO_DEPLOYMENTS.LOCAL)
      return baseEnv;

    const filePath = `${baseEnv}.${MONGO_DEPLOYMENT}`.toLowerCase();
    return existsSync(filePath) ? filePath : baseEnv;
  })();
  // Loads vars in .env into process.env
  dotenv.config({ path: envPath });
}

if (typeof process.env.DB_REPLICA_SET_NAME !== 'undefined') {
  const { default: resolveDns } = await import('./discoverReplicaSet.js');
  try {
    const replicaSetAddress = await resolveDns();
    process.env.DB_URI = `mongodb://${replicaSetAddress}/${process.env.DB_NAME}?replicaSet=${process.env.DB_REPLICA_SET_NAME}`;
  } catch (error) {
    console.error(`Error discovering replica set: ${error.message}`);
    // logger.fatal(`Error discovering replica set: ${error.message}`);
    process.exit(1);
  }
}

const DB_URI =
  process.env.DB_URI ??
  `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// default values
const env = {
  NODE_ENV: 'dev',
  API_URL: 'http://localhost',
  SERVER_PORT: 8080,
  MONGO_DEPLOYMENT: MONGO_DEPLOYMENTS.LOCAL,
  DB_URI: DB_URI ?? 'mongodb://localhost:27017',
  DB_NAME: 'ecommerce',
  JWT_PRIVATE_KEY: '',
  PERSISTENCE: 'MONGO',
};

Object.keys(env).forEach((envKey) => {
  const valueFromEnvFile = process.env[envKey];
  if (valueFromEnvFile) env[envKey] = valueFromEnvFile;
});

export default env;
