import React from 'react';
import { Route } from 'react-router';

import PublicGroup from './containers/PublicGroup';
import Subscriptions from './containers/Subscriptions';
import Donations from './containers/Donations';
import Expenses from './containers/Expenses';

export default (
  <Route path="/">
    <Route path="/subscriptions/:token" component={Subscriptions} />
    <Route path="/:slug" component={PublicGroup} />
    <Route path="/:slug/donations" component={Donations} />
    <Route path="/:slug/expenses" component={Expenses} />
  </Route>
);