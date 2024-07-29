import path from 'node:path';
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';

const { MONGO_DEPLOYMENT } = process.env;

const envPath = (() => {
  const baseEnv = path.join(path.resolve(), '.env');
  if (!MONGO_DEPLOYMENT || MONGO_DEPLOYMENT === 'local') return baseEnv;

  const filePath = `${baseEnv}.${MONGO_DEPLOYMENT}`;
  return existsSync(filePath) ? filePath : baseEnv;
})();
// Loads vars in .env into process.env
dotenv.config({ path: envPath });

if (MONGO_DEPLOYMENT === 'REPLICA_SET') {
  const { default: resolveDns } = await import('./discoverReplicaSet.js');
  try {
    const replicaSetAddress = await resolveDns();
    process.env.DB_URI = `mongodb://${replicaSetAddress}/${process.env.DB_NAME}?replicaSet=${process.env.DB_REPLICA_SET}`;
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
  MONGO_DEPLOYMENT: 'local',
  API_URL: 'http://localhost',
  SERVER_PORT: 8080,
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
