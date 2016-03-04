import React from 'react';
import { Route } from 'react-router';

import PublicGroup from './containers/PublicGroup';
import Subscriptions from './containers/Subscriptions';
import Transactions from './containers/Transactions';
import DonatePage from './containers/DonatePage';

export default (
  <Route path="/">
    <Route path="/subscriptions/:token" component={Subscriptions} />
    <Route path="/:slug" component={PublicGroup} />
    <Route path="/:slug/:type" component={Transactions} />
    <Route path="/:slug/donate/:amount" component={DonatePage} />
    <Route path="/:slug/donate/:amount/:interval" component={DonatePage} />
  </Route>
);