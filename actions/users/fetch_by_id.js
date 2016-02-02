import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/users';

export default (id) => {
  return dispatch => {
    dispatch(request(id));
    return get(`users/${id}`, { schema: Schemas.USER })
      .then(json => dispatch(success(id, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(id) {
  return {
    type: constants.FETCH_USER_REQUEST,
    id
  };
}

function success(id, json) {
  return {
    type: constants.FETCH_USER_SUCCESS,
    id,
    users: json.users,
  };
}

function failure(error) {
  return {
    type: constants.FETCH_USER_FAILURE,
    error,
  };
}
