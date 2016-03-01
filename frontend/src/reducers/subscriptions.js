import merge from 'lodash/object/merge';

import { HYDRATE } from '../constants/session';

export default function subscriptions(state={
  list: []
}, action={}) {
  switch (action.type) {
    case HYDRATE:
      if (!action.data.subscriptions) {
        return state;
      }

      return merge({}, state, {
        list: action.data.subscriptions
      });

    default:
      return state;
  }
}

