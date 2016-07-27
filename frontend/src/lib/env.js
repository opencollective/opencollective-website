/**
 * Environment variables
 */

let NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'undefined') {
  NODE_ENV = 'development';
}

const env = {
  NODE_ENV,
  API_ROOT: `${process.env.WEBSITE_URL}/api`
};

if (env.NODE_ENV === 'circleci' || env.NODE_ENV === 'development') {
  env.API_ROOT = 'http://localhost:3000/api';
}

export default env;
