import {
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from '../../constants/session';

/**
 * Logout user by deleting JWT in localstorage
 */

export default () => {
  localStorage.removeItem('accessToken');

  return !localStorage.getItem('accessToken') ? success() : failure();
};

function success() {
  return {
    type: LOGOUT_SUCCESS
  };
}

function failure() {
  return {
    type: LOGOUT_FAILURE
  };
}
