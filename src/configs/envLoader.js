import dotenv from 'dotenv';

// Loads vars in .env into the Node env variables
dotenv.config();

const env = {
  API_URL: 'http://localhost',
  PORT: 8080,
  DB_HOST: 'mongodb://localhost',
  DB_PORT: 27017,
  DB_NAME: 'estore',
};

Object.keys(env).forEach((envKey) => {
  const envFileValue = process.env[envKey];
  if (envFileValue) env[envKey] = envFileValue;
});

export default env;
