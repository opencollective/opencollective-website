import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';

import form from './form';
import groups from './groups';
import users from './users';
import notification from './notification';
import transactions from './transactions';
import session from './session';
import subscriptions from './subscriptions';

export default combineReducers({
  form,
  groups,
  notification,
  session,
  subscriptions,
  transactions,
  users,
  router
});
