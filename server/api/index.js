import config from 'config';

import { get as clientGet } from '../../lib/api';

/**
 * Get request
 * Extend client side get with the api key
 */
const get = (endpoint) => {
  return clientGet(endpoint, {
    params: {
      api_key: config.apiKey
    }
  });
};

export default { get };