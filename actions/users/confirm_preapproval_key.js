import { post } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Confirm approval key
 */

export default (userid, preapprovalKey) => {
  const url = `users/${userid}/paypal/preapproval/${preapprovalKey}`;

  return dispatch => {
    dispatch(request(userid, preapprovalKey));
    return post(url)
      .then(json => dispatch(success(userid, preapprovalKey, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(userid, preapprovalKey) {
  return {
    type: constants.CONFIRM_APPROVAL_KEY_REQUEST,
    preapprovalKey,
    userid
  };
}

function success(userid, preapprovalKey, json) {
  return {
    type: constants.CONFIRM_APPROVAL_KEY_SUCCESS,
    userid,
    preapprovalKey,
    json
  };
}

function failure(error) {
  return {
    type: constants.CONFIRM_APPROVAL_KEY_FAILURE,
    error
  };
}
