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

// TODO NODE_ENV=test shouldn't be needed once NODE_ENV harmonized to circleci on circleci
if (
  env.NODE_ENV === 'circleci' ||
  env.NODE_ENV === 'test' ||
  env.NODE_ENV === 'development') {
  env.API_ROOT = 'http://localhost:3000/api';
}

export default env;
