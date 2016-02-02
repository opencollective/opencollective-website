import {
  App,
  GroupsList,
  GroupTransactions,
  AddFund,
  TransactionNew,
  TransactionDetail,
  Login,
  Profile,
  PublicGroup,
  PublicTransactions,
  PublicTransaction,
  GroupSettings,
  TransactionEdit,
  ForgotPassword,
  ResetPassword
} from '../containers';

import { requireAuthentication } from '../components/AuthenticatedComponent';

const routes = {
  component: App,
  childRoutes: [
    { path: 'app/login', component: Login },

    { path: 'app/forgot', component: ForgotPassword },
    { path: 'app/reset/:usertoken/:resettoken', component: ResetPassword },

    // Public routes (web)
    { path: 'public/groups/:groupid', component: PublicGroup },
    { path: 'public/groups/:groupid/transactions', component: PublicTransactions },
    { path: 'public/groups/:groupid/transactions/:transactionid', component: PublicTransaction },

    // Private routes (app)
    { path: 'app', component: requireAuthentication(GroupsList) },
    { path: 'app/', component: requireAuthentication(GroupsList) },
    { path: 'app/profile', component: requireAuthentication(Profile) },
    { path: 'app/groups/:groupid/settings', component:requireAuthentication(GroupSettings)},
    { path: 'app/groups/:groupid/transactions', component: requireAuthentication(GroupTransactions)},
    { path: 'app/groups/:groupid/transactions/new', component: requireAuthentication(TransactionNew) },
    { path: 'app/groups/:groupid/transactions/:transactionid', component: requireAuthentication(TransactionDetail) },
    { path: 'app/groups/:groupid/transactions/:transactionid/edit', component: requireAuthentication(TransactionEdit) },
    { path: 'app/groups/:groupid/funds', component: requireAuthentication(AddFund)},

    { path: ':slug', component: PublicGroup },

    // Wildcard route
    { path: '*', component: Login }
  ]
};

export default routes;
