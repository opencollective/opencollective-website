import { get } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Confirm approval key
 */

export default (userid, preapprovalKey) => {
  const url = `users/${userid}/paypal/preapproval/${preapprovalKey}`;

  return dispatch => {
    dispatch(request(userid, preapprovalKey));
    return get(url)
      .then(json => dispatch(success(userid, preapprovalKey, json)))
      .catch(err => dispatch(failure(err)));
  };
};

function request(userid, preapprovalKey) {
  return {
    type: constants.GET_PREAPPROVAL_DETAILS_REQUEST,
    preapprovalKey,
    userid
  };
}

function success(userid, preapprovalKey, json) {
  return {
    type: constants.GET_PREAPPROVAL_DETAILS_SUCCESS,
    userid,
    preapprovalKey,
    json
  };
}

function failure(error) {
  return {
    type: constants.GET_PREAPPROVAL_DETAILS_FAILURE,
    error
  };
}
