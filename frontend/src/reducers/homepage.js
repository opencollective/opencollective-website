import merge from 'lodash/merge';
import { HOMEPAGE_SUCCESS } from '../constants/homepage';
import { HYDRATE } from '../constants/session';

export default function homepage(state={}, action={}) {
  switch (action.type) {
    case HOMEPAGE_SUCCESS:
      const homepage = action.json;
      return merge({}, state, homepage);

    case HYDRATE:
      if (action.data.homepage) {
        const homepage = action.data.homepage;
        return merge({}, state, { ...homepage });
      }
      return state;
    default:
      return state;
  }
}
