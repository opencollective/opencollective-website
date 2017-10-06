import { postJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * Donate to a group
 */

export default (id, donation, options={}) => {
  const url = `/groups/${id}/donations/manual`;

  return dispatch => {
    dispatch(request(id, donation));
    return postJSON(url, { order: donation })
      .then(json => dispatch(success(id, json, options)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(id, donation) {
  return {
    type: constants.ADDFUNDS_GROUP_REQUEST,
    id,
    donation
  };
}

function success(id, json) {
  return {
    type: constants.ADDFUNDS_GROUP_SUCCESS,
    id,
    json
  };
}

function failure(error) {
  return {
    type: constants.ADDFUNDS_GROUP_FAILURE,
    error
  };
}
