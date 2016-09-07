import merge from 'lodash/merge';

import { HYDRATE } from '../constants/session';


export default function users(state={
  profile: {},
  leaderboard: {}
}, action={}) {
  const {
    type,
  } = action;

  switch (type) {
    
    case HYDRATE:
      if (action.data.profile) {
        return merge({}, state, {
          profile: action.data.profile
        });
      }
      return state;

    default:
      return state;
  }
}
