import { auth } from '../../lib/api';
import  decodeJWT from './decode_jwt';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from '../../constants/session';

/**
 * Authenticate user
 */

export default ({email, password}) => {
  return dispatch => {

    dispatch(request(email));
    return auth({
      email,
      password
    })
    .then(json => dispatch(success(json)))
    .then(json => dispatch(decodeJWT(json)))
    .catch(err => {
      dispatch(failure(err));
      throw new Error(err.message);
    });
  };
};

function request(email) {
  return {
    type: LOGIN_REQUEST,
    email
  };
}

function success(json) {
  localStorage.setItem('accessToken', json.access_token);
  localStorage.setItem('refreshToken', json.refresh_token);

  return {
    type: LOGIN_SUCCESS,
    json,
  };
}

function failure(error) {
  return {
    type: LOGIN_FAILURE,
    error,
  };
}
