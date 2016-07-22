import merge from 'lodash/object/merge';
import { INITIAL_RENDER } from '../constants/app';

export default function app(state={}, action={}) {
  switch (action.type) {
    case INITIAL_RENDER:
      return merge({}, state, { rendered: true });
    default:
      return state;
  }
}
