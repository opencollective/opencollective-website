import merge from 'lodash/object/merge';
import { DISCOVER_SUCCESS } from '../constants/discover';
import { HYDRATE } from '../constants/session';

export default function discover(state={}, action={}) {
  switch (action.type) {
    case DISCOVER_SUCCESS:
      const discover = action.json;
      return merge({}, state, discover);
    default:
      return state;
  }
}
