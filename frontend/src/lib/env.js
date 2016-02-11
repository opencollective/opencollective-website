/**
 * Environment variables
 */

const env = {
  NODE_ENV: process.env.NODE_ENV,
  API_ROOT: '/api'
};

if (env.NODE_ENV === 'test' || env.NODE_ENV === 'development') {
  env.API_ROOT = 'http://localhost:3000/api';
}

export default env;
