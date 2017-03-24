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
import LearnMore from './containers/LearnMore';
import Ledger from './containers/Ledger';
import Login from './containers/Login';
import NewGroup from './containers/NewGroup';
import NotFound from './components/NotFound';
import OnBoarding from './containers/OnBoarding';
import PublicPage from './containers/PublicPage';
import Response from './containers/Response';
import Settings from './containers/Settings';
import Subscriptions from './containers/Subscriptions';

import { requireAuthentication } from './components/AuthenticatedComponent';

export default (
  <Route>
    <Route path="/" component={Homepage} />
    <Route path="/about" component={About} />
    <Route path="/faq" component={Faq} />
    <Route path="/discover(/:tag)" component={Discover} />
    <Route path="/learn-more" component={LearnMore} />
    <Route path="/apply" component={NewGroup} />
    <Route path="/create" component={NewGroup} />
    <Route path="/addgroup" component={requireAuthentication(AddGroup)} />
    <Route path="/login/:token" component={Login} />
    <Route path="/login" component={Login} />,
    <Route path="/subscriptions" component={requireAuthentication(Subscriptions)} />

    <Route path="/opensource/apply/:token" component={OnBoarding} />
    <Route path="/opensource/apply" component={OnBoarding} />
    <Redirect from="/github/apply/:token" to="/opensource/apply/:token" />
    <Redirect from="/github/apply" to="/opensource/apply" />

    <Route path="/services/email/unsubscribe" action="unsubscribe" component={Response} />
    <Route path="/services/email/approve" action="approve" component={Response} />

    <Route path="/:slug/apply/:type" component={NewGroup} />
    <Route path="/:slug/apply" component={NewGroup} />
    <Route path="/:slug/connected-accounts" component={ConnectedAccounts} />
    <Route path="/:slug/connect/:provider" component={ConnectProvider} />
    <Route path="/:slug/edit-twitter" component={EditTwitter} />
    <Route path="/:slug/transactions" type="transactions" component={Ledger} />
    <Route path="/:slug/donations" type="donations" component={Ledger} />
    <Route path="/:slug/expenses" type="expenses" component={Ledger} />
    <Route path="/:slug/expenses/new" action="new" component={Ledger} />
    <Route path="/:slug/expenses/:expenseid/approve" action="approve" component={Ledger} />
    <Route path="/:slug/expenses/:expenseid/reject" action="reject" component={Ledger} />
    <Route path="/:slug/settings" component={requireAuthentication(Settings)} />
    // :verb can be donate, pay or contribute
    <Route path="/:slug/:verb/:amount/:interval/:description" component={DonatePage} />
    <Route path="/:slug/:verb/:amount/:interval" component={DonatePage} />
    <Route path="/:slug/:verb/:amount" component={DonatePage} />
    <Route path="/:slug/donate" component={DonatePage} />
    // TODO: this is generating the searchbox on 404s right now
    <Route path="/:slug/:tier" component={GroupTierList} />
    <Route path="/:slug" component={PublicPage} />
    <Route path='*' component={NotFound} />
  </Route>
);
