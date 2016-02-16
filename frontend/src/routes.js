import React from 'react';
import { Route } from 'react-router';

import PublicGroup from './containers/PublicGroup';
import Subscriptions from './containers/Subscriptions';

export default (
  <Route path="/">
    <Route path="/subscriptions" component={Subscriptions} />
    <Route path="/:slug" component={PublicGroup} />
  </Route>
);