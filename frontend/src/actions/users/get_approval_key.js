import { get } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Get approval key for paypal
 */

export default (userid, options={}) => {
  // Redirect to homepage that will confirm the preapproval key
  const callback = `${options.baseUrl}/?paypalApprovalStatus=`;
  const preapprovalTemplate = '${preapprovalKey}';

  const params = {
    returnUrl: `${callback}success&preapprovalKey=${preapprovalTemplate}`,
    cancelUrl: `${callback}cancel`,
  };

  return dispatch => {
    dispatch(request(userid));
    return get(`/users/${userid}/paypal/preapproval`, { params })
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
  // TODO: hacky. Find a better way to do this.
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
