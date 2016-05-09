import React from 'react';
import { Route } from 'react-router';

import PublicGroup from './containers/PublicGroup';
import Subscriptions from './containers/Subscriptions';
import Transactions from './containers/Transactions';
import DonatePage from './containers/DonatePage';
import Leaderboard from './containers/Leaderboard';
import ConnectAccountButton from './containers/ConnectAccountButton';
import OnBoarding from './containers/OnBoarding';

export default (
  <Route path="/">
    <Route path="/subscriptions/:token" component={Subscriptions} />
    <Route path="/subscriptions" component={Subscriptions} />
    <Route path="/leaderboard" component={Leaderboard} />
    <Route path="/opensource/apply" component={OnBoarding} />
    <Route path="/:slug" component={PublicGroup} />
    <Route path="/:slug/expenses/new" component={Transactions} />
    <Route path="/:slug/:type(donations|expenses)" component={Transactions} />
    <Route path="/:slug/donate/:amount" component={DonatePage} />
    <Route path="/:slug/donate/:amount/:interval" component={DonatePage} />
    <Route path="/:slug/connect/:service(github)" component={ConnectAccountButton} />
  </Route>
);
