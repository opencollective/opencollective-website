import fetch from 'isomorphic-fetch';
import { EventEmitter } from 'events';
import { checkStatus } from '../../frontend/src/lib/api';
import apiUrl from '../utils/api_url';

/**
 * Get request
 * Extend client side get with the api key
 */
const memory_cache = {};
const api = { fetch };

api.get = (endpoint, options) => {
  options = options || {};

  let cached = memory_cache[endpoint];
  if (options.cache && cached) {
    return new Promise((resolve) => {
      switch (cached.status) {
        case 'finished':
          return resolve(cached.response);
          break;
        case 'running':
          return cached.once('finished', () => resolve(cached.response));
          break;
      }
    });
  } else {
    memory_cache[endpoint] = cached = new EventEmitter();
    cached.status = 'running';
    return api.fetch(apiUrl(endpoint), {headers: options.headers})
      .then(checkStatus)
      .then((json) => {
        cached.response = json;
        cached.status = 'finished';
        cached.emit('finished');
        setTimeout(() => {
          memory_cache[endpoint] = null;
        }, options.cache * 1000);

        return json;
      });
  }
};

api.post = (endpoint, body) => {
  const options = {
    body,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetch(apiUrl(endpoint), options)
    .then(checkStatus);
};

export default api;
