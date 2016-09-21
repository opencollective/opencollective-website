// This is automatically injected via the Webpack.ProvidePlugin
// import fetch from 'isomorphic-fetch';

import { normalize } from 'normalizr';
import extend from 'lodash/extend';
import queryString from 'query-string';
import env from './env';

const { API_ROOT } = env;

/**
 * Get request
 */

export function get(endpoint, options={}) {
  const { schema, params } = options;

  return fetch(url(endpoint, params), {headers: addAuthTokenToHeader(options.headers)})
    .then(checkStatus)
    .then((json={}) => {
      return schema ? normalize(json, schema).entities : json;
    });
}

export function getThirdParty(endpoint, options={}) {
  const { params } = options;
  return fetch(urlThirdParty(endpoint, params))
    .then(checkStatus)
    .then((json={}) => {
      return json;
    });
}

/**
 * POST json request
 */

export function postJSON(endpoint, body, options={}) {
  let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

  if (options.headers) {
    headers = extend(options.headers, headers);
  } else {
    headers = addAuthTokenToHeader(headers);
  }

  return fetch(url(endpoint), {
    method: 'post',
    headers,
    body: JSON.stringify(body)
  })
  .then(checkStatus);
}

/**
 * PUT json request
 */

export function putJSON(endpoint, body) {
  return fetch(url(endpoint), {
    method: 'put',
    headers: addAuthTokenToHeader({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  })
  .then(checkStatus);
}

/**
 * POST request
 */

export function post(endpoint, body, options={}) {
  return fetch(url(endpoint), {
    headers: addAuthTokenToHeader(options.headers),
    method: 'post',
    body
  })
  .then(checkStatus);
}

/**
 * DELETE request
 */

export function del(endpoint) {
  return fetch(url(endpoint), {
    headers: addAuthTokenToHeader(),
    method: 'delete'
  })
  .then(checkStatus);
}

/**
 * Build url to the api
 */

function url(endpoint, params) {
  const query = queryString.stringify(params);

  return `${API_ROOT + endpoint}${query.length > 0 ? `?${query}` : '' }`;
}

/**
 * Build a url to a third party
 */
function urlThirdParty(endpoint, params) {
  const query = queryString.stringify(params);

  return `${endpoint}${query.length > 0 ? `?${query}` : '' }`;
}

/**
 * The Promise returned from fetch() won't reject on HTTP error status. We
 * need to throw an error ourselves.
 */

export function checkStatus(response) {
  const { status } = response;

  if (status >= 200 && status < 300) {
    return response.json();
  } else {
    return response.json()
    .then((json) => {
      const error = new Error(json.error.message);
      error.json = json;
      error.response = response;
      throw error;
    });
  }
}

function addAuthTokenToHeader(obj) {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return obj;
  return {
    Authorization: `Bearer ${accessToken}`,
    ...obj
  };
}
