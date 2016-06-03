import merge from 'lodash/object/merge';

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
        console.log("merging", action.data);
        return merge({}, state, {
          profile: action.data.profile
        });
      }
      return state;

    default:
      return state;
  }
}