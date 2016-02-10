import merge from 'lodash/object/merge';

import * as constants from '../constants/users';
import {DONATE_GROUP_SUCCESS} from'../constants/groups';

export default function users(state={
  updateInProgress: false,
  cards: []
}, action={}) {
  const {
    type,
    error,
    users
  } = action;

  switch (type) {

    case constants.FETCH_USERS_BY_GROUP_SUCCESS:
      return merge({}, state, users);

    case constants.UPDATE_USER_REQUEST:
      return merge({}, state, { updateInProgress: true });

    case constants.UPDATE_USER_SUCCESS:
      return merge({}, state, { updateInProgress: false });

    case constants.UPDATE_USER_FAILURE:
      return merge({}, state, { updateInProgress: false, error });

    case constants.FETCH_USERS_BY_GROUP_FAILURE:
      return merge({}, state, { error });

    case DONATE_GROUP_SUCCESS:
      return merge({}, state, {
        newUser: action.json.user
      });

    default:
      return state;
  }
}
