import { combineReducers } from 'redux';

import form from './form';
import groups from './groups';
import users from './users';
import notification from './notification';
import transactions from './transactions';
import session from './session';

export default combineReducers({
  form,
  groups,
  notification,
  session,
  transactions,
  users
});
