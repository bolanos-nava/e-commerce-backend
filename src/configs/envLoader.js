import dotenv from 'dotenv';

// Loads vars in .env into the Node env variables
dotenv.config();

const env = {
  API_URL: 'http://localhost',
  PORT: 8080,
};

Object.keys(env).forEach((envKey) => {
  const envFileValue = process.env[envKey];
  if (envFileValue) env[envKey] = envFileValue;
});

export default env;
