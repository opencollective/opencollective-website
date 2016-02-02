import * as constants from '../../constants/users';
import fetchUserById from './fetch_by_id';

/**
 * Fetch a user and return the cached one if exists
 */

export default (id) => {
  return (dispatch, getState) => {
    const user = getState().users[id];
    if (!user || !user.id) {
      return dispatch(fetchUserById(id));
    } else {
      return dispatch(fetchUserFromState(user));
    }
  };
};

function fetchUserFromState(user) {
  return {
    type: constants.FETCH_USER_FROM_STATE,
    user
  };
}
