import merge from 'lodash/merge';

import { HYDRATE } from '../constants/session';

export default function collectives(state={}, action={}) {
  switch (action.type) {

    case HYDRATE:
      if (action.data.collective) {
        return merge({}, state, {
          [action.data.collective.slug]: action.data.collective
        });
      }
      return state;

    default:
      return state;
  }
}

