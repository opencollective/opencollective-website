import merge from 'lodash.merge';
import * as constants from '../constants/groups';

export default function groups(state={}, action={}) {
  switch (action.type) {

    case constants.GROUP_SUCCESS:
    case constants.GROUPS_SUCCESS:
      return merge({}, state, action.groups);

    case constants.GROUP_SUCCESS:
    case constants.GROUPS_SUCCESS:
      return merge({}, state, action.groups);

    case constants.DONATE_GROUP_REQUEST:
      return merge({}, state, { donateInProgress: true });

    case constants.DONATE_GROUP_SUCCESS:
      return merge({}, state, {
        donateInProgress: false,
        payment: action.json.payment
      });

    case constants.DONATE_GROUP_FAILURE:
      return merge({}, state, {
        donateInProgress: false,
        error: action.error
      });

    default:
      return state;
  }
}

