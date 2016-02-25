import merge from 'lodash/object/merge';
import values from 'lodash/object/values';
import groupBy from 'lodash/collection/groupBy';

import * as constants from '../constants/groups';
import { FETCH_USERS_BY_GROUP_SUCCESS } from '../constants/users';

export default function groups(state={}, action={}) {
  switch (action.type) {

    case constants.GROUP_SUCCESS:
      return merge({}, state, action.groups);

    // 8: {
    //   usersByRoles: {
    //    HOST: [{id:...}]
    //
    //  }
    // }
    case FETCH_USERS_BY_GROUP_SUCCESS:
      const users = values(action.users)

      return merge({}, state, {
        [action.groupid]: {
          usersByRole: groupBy(users, 'role')
        }
      });

    case constants.DONATE_GROUP_REQUEST:
      return merge({}, state, { donateInProgress: true });

    case constants.DONATE_GROUP_SUCCESS:
      return merge({}, state, {
        donateInProgress: false,
        payment: action.json.payment
      });

    case constants.DONATE_GROUP_FAILURE:
      return merge({}, state, {
        donateInProgress: false,
        error: action.error
      });

    default:
      return state;
  }
}

