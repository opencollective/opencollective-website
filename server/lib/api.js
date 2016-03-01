import fetch from 'isomorphic-fetch';

import { checkStatus } from '../../frontend/src/lib/api';
import apiUrl from '../utils/api_url';

/**
 * Get request
 * Extend client side get with the api key
 */
const get = (endpoint, headers) => {
  headers = headers || {};
  return fetch(apiUrl(endpoint), {headers: headers})
    .then(checkStatus);
};

export default { get };