import path from 'node:path';
import dotenv from 'dotenv';

const { NODE_ENV } = process.env;
// Loads vars in .env into the Node env variables
dotenv.config({
  path:
    NODE_ENV === 'dev'
      ? `${path.resolve()}/.env`
      : `${path.resolve()}/.env.${NODE_ENV}`,
});

const env = {
  NODE_ENV: 'development',
  API_URL: 'http://localhost',
  PORT: 8080,
  DB_URI: 'mongodb://localhost:27017/ecommerce',
};

Object.keys(env).forEach((envKey) => {
  const envFileValue = process.env[envKey];
  if (envFileValue) env[envKey] = envFileValue;
});

export default env;
