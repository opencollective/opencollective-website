import React from 'react';
import { Route, Redirect } from 'react-router';

import About from './containers/About';
import AddGroup from './containers/AddGroup';
import ConnectedAccounts from './components/ConnectedAccounts';
import ConnectProvider from './containers/ConnectProvider';
import Discover from './containers/Discover';
import DonatePage from './containers/DonatePage';
import EditTwitter from './components/EditTwitter';
import Faq from './containers/Faq';
import GroupTierList from './containers/GroupTierList';
import Homepage from './containers/HomePage';
import Ledger from './containers/Ledger';
import Login from './containers/Login';
import NewGroup from './containers/NewGroup';
import OnBoarding from './containers/OnBoarding';
import PublicPage from './containers/PublicPage';
import Response from './containers/Response';
import Subscriptions from './containers/Subscriptions';

import { requireAuthentication } from './components/AuthenticatedComponent';

export default (
  <Route>
    <Route path="/" component={Homepage} />
    <Route path="/services/email/:action(unsubscribe|approve)" component={Response} />
    <Route path="/about" component={About} />
    <Route path="/faq" component={Faq} />
    <Route path="/discover(/:tag)" component={Discover} />
    <Route path="/create" component={NewGroup} />
    <Route path="/addgroup" component={requireAuthentication(AddGroup)} />
    <Route path="/login/:token" component={Login} />
    <Route path="/login" component={Login} />,
    <Route path="/subscriptions" component={requireAuthentication(Subscriptions)} />
    <Route path="/opensource/apply/:token" component={OnBoarding} />
    <Route path="/opensource/apply" component={OnBoarding} />
    <Route path="/:slug/apply/:type" component={NewGroup} />
    <Redirect from="/github/apply/:token" to="/opensource/apply/:token" />
    <Redirect from="/github/apply" to="/opensource/apply" />
    <Route path="/:slug/connected-accounts" component={ConnectedAccounts} />
    <Route path="/:slug/connect/:provider" component={ConnectProvider} />
    <Route path="/:slug/edit-twitter" component={EditTwitter} />
    <Route path="/:slug" component={PublicPage} />
    <Route path="/:slug/donate/:amount" component={DonatePage} />
    <Route path="/:slug/donate/:amount/:interval" component={DonatePage} />
    <Route path="/:slug/:type(donations|expenses|transactions)" component={Ledger} />
    <Route path="/:slug/:type(expenses)/:action(new)" component={Ledger} />
    <Route path="/:slug/:type(expenses)/:expenseid/:action(approve|reject)" component={Ledger} />
    <Route path="/:slug/:type(donations)/:action(request)" component={Ledger} />
    <Route path="/:slug/donate/:amount/:interval/:description" component={DonatePage} />
    <Route path="/:slug/:tier" component={GroupTierList} />
  </Route>
);
