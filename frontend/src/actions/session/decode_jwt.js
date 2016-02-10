import jwtDecode from 'jwt-decode';
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
    failure();
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
