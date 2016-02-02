import { get } from '../../lib/api';
import origin from '../../lib/origin';
import * as constants from '../../constants/users';

/**
 * Get approval key for paypal
 */

export default (userid, options={}) => {
  // Redirect to homepage that has will confirmed the preapproval key
  const callback = `${origin}/app/?approvalStatus=`;

  const params = {
    returnUrl: callback + 'success&preapprovalKey=${preapprovalKey}',
    cancelUrl: callback + 'cancel',
    maxTotalAmountOfAllPayments: options.maxTotalAmountOfAllPayments || 2000
  };

  return dispatch => {
    dispatch(request(userid));
    return get(`users/${userid}/paypal/preapproval`, { params })
      .then(json => dispatch(success(userid, json)))
      .catch(err => dispatch(failure(err)));
  };
};

function request(userid) {
  return {
    type: constants.GET_APPROVAL_KEY_FOR_USER_REQUEST,
    userid
  };
}

function success(userid, json) {
  window.location = json.preapprovalUrl;

  return {
    type: constants.GET_APPROVAL_KEY_FOR_USER_SUCCESS,
    userid,
    json
  };
}

function failure(error) {
  return {
    type: constants.GET_APPROVAL_KEY_FOR_USER_FAILURE,
    error
  };
}
