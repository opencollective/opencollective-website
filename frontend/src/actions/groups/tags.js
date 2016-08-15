import { get } from '../../lib/api';
import * as constants from '../../constants/groups';

export default () => {
  return dispatch => {
    dispatch(request());

    return get('/groups/tags')
    .then(json => dispatch(success(json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request() {
  return {
    type: constants.GROUP_TAGS_REQUEST
  };
}

export function success(json) {
  return {
    type: constants.GROUP_TAGS_SUCCESS,
    json
  };
}

function failure(error) {
  return {
    type: constants.GROUP_TAGS_FAILURE,
    error
  };
}
