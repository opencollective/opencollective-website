import React from 'react';
import { Route } from 'react-router';

import PublicPage from './containers/PublicPage';
import Subscriptions from './containers/Subscriptions';
import Transactions from './containers/Transactions';
import DonatePage from './containers/DonatePage';
import OnBoarding from './containers/OnBoarding';
import Login from './containers/Login';
import Ledger from './containers/Ledger';
import ConnectedAccounts from './components/ConnectedAccounts';
import ConnectProvider from './containers/ConnectProvider';
import EditTwitter from './components/EditTwitter';
import HomePage from './containers/HomePage';
import Faq from './containers/Faq';
import Discover from './containers/Discover';
import About from './containers/About';
import AddGroup from './containers/AddGroup';
import NewGroup from './containers/NewGroup';
import GroupTierList from './containers/GroupTierList';
import Response from './containers/Response';

import { requireAuthentication } from './components/AuthenticatedComponent';

export default (
  <Route>
    <Route path="/" component={HomePage} />
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
    {/* Leaving github/apply routes for existing links */}
    <Route path="/github/apply/:token" component={OnBoarding} />
    <Route path="/github/apply" component={OnBoarding} />
    <Route path="/:slug/connected-accounts" component={ConnectedAccounts} />
    <Route path="/:slug/connect/:provider" component={ConnectProvider} />
    <Route path="/:slug/edit-twitter" component={EditTwitter} />
    <Route path="/:slug" component={PublicPage} />
    <Route path="/:slug/transactions" component={Ledger} />
    <Route path="/:slug/expenses/new" component={Transactions} />
    <Route path="/:slug/:type(donations|expenses)" component={Transactions} />
    <Route path="/:slug/donate/:amount" component={DonatePage} />
    <Route path="/:slug/donate/:amount/:interval" component={DonatePage} />
    <Route path="/:slug/:tier" component={GroupTierList} />
  </Route>
);
