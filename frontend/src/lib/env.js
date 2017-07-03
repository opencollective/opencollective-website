/**
 * Environment variables
 */

if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'development';
}

const env = {
  NODE_ENV: process.env.NODE_ENV,
  API_ROOT: `${process.env.WEBSITE_URL}/api`
};

if (env.NODE_ENV === 'circleci' || env.NODE_ENV === 'development') {
  env.API_ROOT = 'https://aseem-macbook-air.local:8443/api';
}

export default env;
