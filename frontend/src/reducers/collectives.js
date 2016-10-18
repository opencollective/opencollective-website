import merge from 'lodash/merge';
import values from 'lodash/values';
import groupBy from 'lodash/groupBy';

import { fromJS } from 'immutable';

import { HYDRATE } from '../constants/session';
// import * as constants from '../constants/collectives'; TODO: re-enable
import * as constants from '../constants/groups'; // TODO: remove
import { FETCH_USERS_BY_GROUP_SUCCESS } from '../constants/users';

const DEFAULT_COLLECTIVE_SETTINGS = {
  lang: 'en',
  formatCurrency: {
    compact: false,
    precision: 2
  }
};

const initialState = {} //fromJS({});

export default function collectives(state = initialState, action={}) {
  switch (action.type) {

    case HYDRATE:
      if (action.data.collective) {
        return merge({}, state, {
          [action.data.collective.slug]: merge({}, {settings: DEFAULT_COLLECTIVE_SETTINGS}, action.data.collective)
        });
        /*
        return state
          .set(action.data.collective.slug, action.data.collective)
          //.updateIn([action.data.collective.slug, 'settings'], action.data.collective.settings || DEFAULT_COLLECTIVE_SETTINGS)
          //.updateIn([action.data.collective.slug, 'settings', 'lang'], action.data.collective.settings.lang || 'en');
        */
      }
      return state;

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
          users,
          usersByRole: groupBy(users, 'role')
        }
      });
    }

    default:
      return state;
  }
}

