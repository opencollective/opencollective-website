import merge from 'lodash/object/merge';

import { HYDRATE } from '../constants/session';
import { GET_SUBSCRIPTIONS_SUCCESS } from '../constants/subscriptions'

export default function subscriptions(state={
  list: []
}, action={}) {
  switch (action.type) {
    case GET_SUBSCRIPTIONS_SUCCESS:
      return merge({}, state, {
        list: action.subscriptions
      });

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

