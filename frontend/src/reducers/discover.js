import merge from 'lodash/object/merge';
import { DISCOVER_SUCCESS } from '../constants/discover';

export default function discover(state={}, action={}) {
  switch (action.type) {
    case DISCOVER_SUCCESS:
    const discover = action.json;
    if (state.show) {
      if (state.show === discover.show && state.sort === discover.sort) {
        if (state.collectives) {
          for (let i = state.collectives.length - 1; i >= 0; i--) {
            discover.collectives.unshift(state.collectives[i]);
          }
          return merge({}, state, discover);
        } else {
          return merge(state, discover);
        }
      } else {
        return discover;
      }
    } else {
      return merge({}, state, discover);
    }
  default:
    return state;
  }
}
