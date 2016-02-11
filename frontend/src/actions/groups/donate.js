import { postJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * Donate to a group
 */

export default (id, payment) => {
  const url = `/groups/${id}/payments/`;

  return dispatch => {
    dispatch(request(id, payment));
    return postJSON(url, {payment})
      .then(json => dispatch(success(id, json)))
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

function success(id, json) {
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
