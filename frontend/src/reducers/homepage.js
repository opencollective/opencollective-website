import merge from 'lodash/object/merge';
import { HOMEPAGE_SUCCESS } from '../constants/homepage';

export default function homepage(state={}, action={}) {
  switch (action.type) {
    case HOMEPAGE_SUCCESS:
      const homepage = action.json;
      return merge({}, state, homepage);
    default:
      return state;
  }
}
