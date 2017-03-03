import { get } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Authorize stripe
 */

export default (returnUrl) => {
  return dispatch => {
    dispatch(request());
    return get('/stripe/authorize', { params: { returnUrl }})
      .then(json => {
        dispatch(success(json));
        window.location = json.redirectUrl;
      })
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request() {
  return {
    type: constants.AUTHORIZE_STRIPE_REQUEST
  };
}

function success(json) {
  return {
    type: constants.AUTHORIZE_STRIPE_SUCCESS,
    json
  };
}

function failure(error) {
  return {
    type: constants.AUTHORIZE_STRIPE_FAILURE,
    error
  };
}
