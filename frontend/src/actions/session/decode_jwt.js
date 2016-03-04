import jwtDecode from 'jwt-decode';

import isExpired from '../../lib/is_expired';
import {
  DECODE_JWT_SUCCESS,
  DECODE_JWT_FAILURE,
  DECODE_JWT_EMPTY
} from '../../constants/session';


/**
 * Load info from JWT if it exists
 */

export default () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return empty();
  }

  let json = {};
  try {
    // This library doesn't have validation
    json = jwtDecode(accessToken);
  } catch (e) {
    return failure();
  }

  // delete JWT if expired
  if (isExpired(json.exp)) {
    localStorage.removeItem('accessToken');
    return failure();
  }

  return json.id ? success(json) : failure();
};

function failure() {
  return {
    type: DECODE_JWT_FAILURE
  };
}

function success(user) {
  return {
    type: DECODE_JWT_SUCCESS,
    user
  };
}

function empty() {
  return {
    type: DECODE_JWT_EMPTY
  };
}
