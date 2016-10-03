import merge from 'lodash/merge';
import values from 'lodash/values';
import groupBy from 'lodash/groupBy';

import * as constants from '../constants/groups';
import { FETCH_USERS_BY_GROUP_SUCCESS } from '../constants/users';
import { HYDRATE } from '../constants/session';

export default function groups(state={}, action={}) {
  switch (action.type) {

    case HYDRATE:
      if (action.data.group) {
        return merge({}, state, {
          [action.data.group.slug]: action.data.group
        });
      } else if (action.data.leaderboard) {
        return merge({}, state, {
          leaderboard: action.data.leaderboard
        });
      }
      return state;

    case constants.PROFILE_SUCCESS:
    case constants.GROUP_SUCCESS:
      return merge({}, state, action.groups);

    // 8: {
    //   usersByRoles: {
    //    HOST: [{id:...}]
    //
    //  }
    // }
    case FETCH_USERS_BY_GROUP_SUCCESS: {
      const users = values(action.users);

      return merge({}, state, {
        [action.slug]: {
          usersByRole: groupBy(users, 'role')
        }
      });
    }
    case constants.DONATE_GROUP_REQUEST:
      return merge({}, state, { donateInProgress: true });

    case constants.DONATE_GROUP_SUCCESS:
      return merge({}, state, {
        donateInProgress: false,
        payment: action.json.payment,
        donationIsDone: true
      });

    case constants.DONATE_GROUP_FAILURE:
      return merge({}, state, {
        donateInProgress: false,
        error: action.error
      });

    case constants.GET_LEADERBOARD_SUCCESS:
      return merge({}, state, {
        leaderboard: action.json
      });

    case constants.GROUP_TAGS_SUCCESS:
      return merge({}, state, {
        tags: action.json
      });
    case constants.GROUP_TIER_LIST_SUCCESS:
      return merge({}, state, {
        tierList: action.tierList
      });
    default:
      return state;
  }
}

