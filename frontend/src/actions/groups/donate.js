import { postJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * Donate to a group
 */

export default (id, payment, options={}) => {
  const url = `/groups/${id}/payments/${options.paypal ? 'paypal' : ''}`;

  return dispatch => {
    dispatch(request(id, payment));
    return postJSON(url, {payment})
      .then(json => dispatch(success(id, json, options)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(id, payment) {
  return {
    type: constants.DONATE_GROUP_REQUEST,
    id,
    payment
  };
}

function success(id, json, options) {
  if (options.paypal) {
    window.location = json.links[0].href; // approval_url
  }

  return {
    type: constants.DONATE_GROUP_SUCCESS,
    id,
    json
  };
}

function failure(error) {
  return {
    type: constants.DONATE_GROUP_FAILURE,
    error
  };
}
