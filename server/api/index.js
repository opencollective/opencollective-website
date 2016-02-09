import config from 'config';
import fetch from 'isomorphic-fetch';

import { checkStatus } from '../../lib/api';
import apiUrl from '../utils/api_url';

/**
 * Get request
 * Extend client side get with the api key
 */
const get = (endpoint) => {
  return fetch(apiUrl(endpoint))
    .then(checkStatus);
};

export default { get };