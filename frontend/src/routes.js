import React from 'react';
import { Route } from 'react-router';

import PublicGroup from './containers/PublicGroup';
import Subscriptions from './containers/Subscriptions';
import Transactions from './containers/Transactions';

export default (
  <Route path="/">
    <Route path="/subscriptions/:token" component={Subscriptions} />
    <Route path="/:slug" component={PublicGroup} />
    <Route path="/:slug/:type" component={Transactions} />
  </Route>
);