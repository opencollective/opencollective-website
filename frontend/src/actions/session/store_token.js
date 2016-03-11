import {
  STORE_TOKEN_FAILURE,
  STORE_TOKEN_SUCCESS
} from '../../constants/session';

/**
 * Store the token locally
 */

export default (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    return success();
  }
  return failure();
};

function success() {
  return {
    type: STORE_TOKEN_SUCCESS
  };
}

function failure() {
  return {
    type: STORE_TOKEN_FAILURE
  };
}