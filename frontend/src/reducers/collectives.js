import merge from 'lodash/merge';
import values from 'lodash/values';
import groupBy from 'lodash/groupBy';

import { HYDRATE } from '../constants/session';
// import * as constants from '../constants/collectives'; TODO: re-enable
import * as constants from '../constants/groups'; // TODO: remove
import { FETCH_USERS_BY_GROUP_SUCCESS } from '../constants/users';

const initialState = {}

export default function collectives(state = initialState, action={}) {
  switch (action.type) {

    case HYDRATE:
      if (action.data.collective) {
        return merge({}, state, {
          [action.data.collective.slug]: merge({}, action.data.collective)
        });

      }
      return state;

    case constants.PROFILE_SUCCESS:
    case constants.GROUP_SUCCESS:
      return merge({}, state, action.groups);

    case FETCH_USERS_BY_GROUP_SUCCESS: {
      const users = values(action.users);

      return merge({}, state, {
        [action.slug]: {
          users,
          usersByRole: groupBy(users, 'role')
        }
      });
    }

    default:
      return state;
  }
}

