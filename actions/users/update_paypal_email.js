import { putJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * update paypal email for user
 */

export default (userid, paypalEmail) => {
  const url = `users/${userid}/paypalemail`;

  return dispatch => {
    dispatch(request(userid, paypalEmail));
    return putJSON(url, { paypalEmail })
      .then(json => dispatch(success(userid, paypalEmail, json)))
      .catch(err => {
        dispatch(failure(err))
        throw new Error(err.message);
      });
  };
};

function request(userid, paypalEmail) {
  return {
    type: constants.UPDATE_PAYPAL_EMAIL_REQUEST,
    paypalEmail,
    userid
  };
}

function success(userid, paypalEmail, json) {
  return {
    type: constants.UPDATE_PAYPAL_EMAIL_SUCCESS,
    userid,
    paypalEmail,
    json
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_PAYPAL_EMAIL_FAILURE,
    error
  };
}
