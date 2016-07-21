import merge from 'lodash/object/merge';

import Schemas from '../lib/schemas';
import { normalize } from 'normalizr';

import * as constants from '../constants/users';
import {DONATE_GROUP_SUCCESS} from '../constants/groups';


export default function users(state={
  updateInProgress: false,
  sendingEmailInProgress: false,
  cards: []
}, action={}) {
  const {
    type,
    error,
    users
  } = action;

  switch (type) {

    case constants.FETCH_USER_SUCCESS:
    case constants.FETCH_USERS_BY_GROUP_SUCCESS:
      /*
       * Note: the 'role' and 'createdAt' is stored in groups reducer.
       * Removing them from here so we can merge user data (which comes
       * appended with userGroup data) without conflicts
       */
      const options = {
        assignEntity: function(obj, key, val){
          if (key !== 'role' && key !== 'createdAt') {
            obj[key] = val;
          }
        }
      };
      return merge({}, state, normalize(users, Schemas.USER_ARRAY, options).entities.users);

    case constants.REFRESH_LOGIN_TOKEN_REQUEST:
    case constants.SEND_NEW_LOGIN_TOKEN_REQUEST:
      return merge({}, state, { sendingEmailInProgress: true });

     case constants.UPDATE_USER_REQUEST:
      return merge({}, state, { updateInProgress: true });

    case constants.SEND_NEW_LOGIN_TOKEN_SUCCESS:
    case constants.REFRESH_LOGIN_TOKEN_SUCCESS:
      return merge({}, state, { sendingEmailInProgress: false });

    case constants.UPDATE_USER_SUCCESS:
      return merge({}, state, { updateInProgress: false });

    case constants.SEND_NEW_LOGIN_TOKEN_FAILURE:
    case constants.REFRESH_LOGIN_TOKEN_FAILURE:
      return merge({}, state, { sendingEmailInProgress: false, error });

    case constants.UPDATE_USER_FAILURE:
      return merge({}, state, { updateInProgress: false, error });

    case constants.FETCH_USERS_BY_GROUP_FAILURE:
      return merge({}, state, { error });

    case DONATE_GROUP_SUCCESS:
      return merge({}, state, {
        newUser: action.json.user
      });

    default:
      return state;
  }
}
