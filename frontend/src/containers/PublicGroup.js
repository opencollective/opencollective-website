import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';
import take from 'lodash/array/take';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import filterCollection from '../lib/filter_collection';
import formatCurrency from '../lib/format_currency';

import roles from '../constants/roles';
import PublicTopBar from '../containers/PublicTopBar';
import Notification from '../containers/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import TransactionItem from '../components/TransactionItem';
import Media from '../components/Media';
import Metric from '../components/Metric';
import UsersList from '../components/UsersList';
import ShareIcon from '../components/ShareIcon';
import Icon from '../components/Icon';
import DisplayUrl from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Tiers from '../components/Tiers';
import Markdown from '../components/Markdown';

import fetchGroup from '../actions/groups/fetch_by_id';
import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update';
import validateSchema from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';

import profileSchema from '../joi_schemas/profile';
import strings from '../ui/strings.json';

// Number of expenses and revenue items to show on the public page
const NUM_TRANSACTIONS_TO_SHOW = 3;

export class PublicGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
  }

  donationSection() {
    const {
      group,
      isAuthenticated,
      donationForm,
      showPaypalThankYou
    } = this.props;

    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm) || showPaypalThankYou) { // we don't handle userform from logged in users) {
      return <PublicGroupThanks />;
    } else if (this.state.showUserForm) {
      return <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
    } else {
      return <Tiers tiers={group.tiers} {...this.props} form={donationForm} onToken={donateToGroup.bind(this)} />
    }
  }

  expenseList() {
    const {
      expenses,
      users,
      group
    } = this.props;

    const emptyState = (
      <div className='PublicGroup-emptyState'>
        <div className='PublicGroup-expenseIcon'>
          <Icon type='expense' />
        </div>
        <label>
          All your approved expenses will show up here
        </label>
      </div>
    );

    return (
      <div className='PublicGroup-expenses'>
        <h2>Expenses</h2>
        {(expenses.length === 0) && emptyState}
        {expenses.map(expense => <TransactionItem key={expense.id} transaction={expense} user={users[expense.UserId]} />)}
        <Link className='PublicGroup-tx-link' to={`/${group.slug}/expenses/new`}>
          Submit an expense
        </Link>
        {expenses.length >= NUM_TRANSACTIONS_TO_SHOW && (
          <Link className='PublicGroup-tx-link' to={`/${group.slug}/expenses`}>
            See all expenses
          </Link>
        )}
      </div>
    );

  }

  donationList() {
    const {
      donations,
      users,
      group
    } = this.props;

    const emptyState = (
      <div className='PublicGroup-emptyState'>
        <div className='PublicGroup-donationIcon'>
          <Icon type='revenue' />
        </div>
        <label>
          All your latest donations will show up here
        </label>
      </div>
    );

    return (
      <div className='PublicGroup-donations'>
        <h2>Revenue</h2>
        {(donations.length === 0) && emptyState}

        {donations.map(donation => <TransactionItem key={donation.id} transaction={donation} user={users[donation.UserId]} />)}

        {donations.length >= NUM_TRANSACTIONS_TO_SHOW && (
          <Link className='PublicGroup-tx-link' to={`/${group.slug}/donations`}>
            See all donations
          </Link>
        )}
      </div>
    );
  }

  render() {
    const {
      group,
      shareUrl,
    } = this.props;

    return (
      <div className='PublicGroup'>

        <PublicTopBar />
        <Notification />

        <div className='PublicContent'>

          <div className='PublicGroupHeader'>
            <img className='PublicGroupHeader-logo' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
            <div className='PublicGroupHeader-website'><DisplayUrl url={group.website} /></div>
            <div className='PublicGroupHeader-host'>Hosted by <a href={group.host.website}>{group.host.name}</a></div>
            <div className='PublicGroupHeader-description'>
              {group.description}
            </div>
          </div>

          <Media group={group} />

          <div className='PublicGroup-summary'>
            <div className='PublicGroup-metricContainer'>
              <Metric
                label='Funds Available'
                value={formatCurrency(group.balance, group.currency, {precision: 0})} />
              <Metric
                label='Backers'
                value={group.backersCount} />
            </div>
            <a className='Button Button--green PublicGroup-support' href='#support'>
              Back us
            </a>
            <div className='PublicGroup-share'>
              <ShareIcon type='twitter' url={shareUrl} name={group.name} description={group.description} />
              <ShareIcon type='facebook' url={shareUrl} name={group.name} description={group.description} />
              <ShareIcon type='mail' url={shareUrl} name={group.name} description={group.description} />
            </div>
          </div>

          <div className='PublicGroup-quote'>
            <h2>Our collective</h2>
            <div className='PublicGroup-members'>
              <UsersList users={group.members} />
            </div>
            <Markdown className='PublicGroup-quoteText' value={group.longDescription} />
          </div>

          <div id='support'></div>
          {this.donationSection()}

          <div className='PublicGroup-transactions'>
            {this.expenseList()}
            {this.donationList()}
          </div>

        </div>
        <PublicFooter />
      </div>
    );
  }

  componentDidMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers,
      fetchGroup
    } = this.props;

    fetchGroup(group.id);

    fetchTransactions(group.id, {
      per_page: NUM_TRANSACTIONS_TO_SHOW,
      sort: 'createdAt',
      direction: 'desc',
      donation: true
    });

    fetchTransactions(group.id, {
      per_page: NUM_TRANSACTIONS_TO_SHOW,
      sort: 'createdAt',
      direction: 'desc',
      expense: true
    });

    fetchUsers(group.id);
  }

  componentWillMount() {
    const {
      decodeJWT,
      paypalIsDone,
      hasFullAccount
    } = this.props;

    // decode here because we don't handle auth on the server side yet
    decodeJWT();

    if (paypalIsDone) {
      this.refreshData();
      this.setState({
        showUserForm: !hasFullAccount,
        showThankYouMessage: hasFullAccount
      });
    }
  }

  // Used after a donation
  refreshData() {
    const {
      group,
      fetchGroup,
      fetchUsers,
      fetchTransactions
    } = this.props;

    return Promise.all([
      fetchGroup(group.id),
      fetchUsers(group.id),
      fetchTransactions(group.id, {
        per_page: NUM_TRANSACTIONS_TO_SHOW,
        sort: 'createdAt',
        direction: 'desc',
        donation: true
      })
    ]);
  }
}

export function donateToGroup({amount, frequency, currency, token, options}) {
  const {
    notify,
    donate,
    group
  } = this.props;

  const payment = {
    stripeToken: token && token.id,
    email: token && token.email,
    amount,
    currency
  };

  if (frequency === 'monthly') {
    payment.interval = 'month';
  } else if (frequency === 'yearly') {
    payment.interval = 'year';
  }

  return donate(group.id, payment, options)
    .then(() => {
      if (options && options.paypal) {
        // Paypal will redirect to this page and we will refresh at that moment
        return;
      }
        // stripe donation is immediate after the request
      return this.refreshData()
      .then(() => {
        this.setState({
          showUserForm: !this.props.hasFullAccount,
          showThankYouMessage: this.props.hasFullAccount
        });
      });
    })
    .catch((err) => notify('error', err.message));
}

export function saveNewUser() {
 const {
    newUser,
    updateUser,
    profileForm,
    validateSchema,
    notify,
    group,
    fetchUsers
  } = this.props;

  return validateSchema(profileForm.attributes, profileSchema)
    .then(() => updateUser(newUser.id, profileForm.attributes))
    .then(() => this.setState({
      showUserForm: false,
      showThankYouMessage: true
    }))
    .then(() => fetchUsers(group.id))
    .catch(({message}) => notify('error', message));
}

export default connect(mapStateToProps, {
  donate,
  notify,
  fetchTransactions,
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  validateSchema,
  decodeJWT,
  appendDonationForm
})(PublicGroup);

function mapStateToProps({
  groups,
  form,
  transactions,
  users,
  session,
  router
}) {
  const query = router.location.query;
  const newUserId = query.userid;
  const paypalUser = {
    id: query.userid,
    hasFullAccount: query.has_full_account === 'true'
  };

  const newUser = users.newUser || paypalUser;

  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group
  const usersByRole = group.usersByRole || {};

  /* @xdamman:
   * We should refactor this. The /api/group route should directly return
   * group.host, group.backers, group.members, group.donations, group.expenses
   */
  group.id = Number(group.id);

  group.hosts = usersByRole[roles.HOST] || [];
  group.members = usersByRole[roles.MEMBER] || [];
  group.backers = usersByRole[roles.BACKER] || [];

  group.host = group.hosts[0] || {};

  group.backersCount = group.backers.length;
  group.transactions = filterCollection(transactions, { GroupId: group.id });

  group.settings = {
    lang: 'en',
    formatCurrency: {
      compact: false,
      precision: 2
    }
  };

  if(group.slug === 'laprimaire') {
    group.settings = {
      lang: 'fr',
      formatCurrency: {
        compact: true,
        precision: 0
      }
    };
  }

  const i18n = {
    getString: (strid) => {
      return strings[group.settings.lang][strid]; // TODO: We should add a `lang` column in the `Groups` table and use that instead of `currency`
    }
  };

  const donations = transactions.isDonation;
  const expenses = transactions.isExpense;

  return {
    group,
    users,
    session,
    donations: take(sortBy(donations, txn => txn.createdAt).reverse(), NUM_TRANSACTIONS_TO_SHOW),
    expenses: take(sortBy(expenses, exp => exp.createdAt).reverse(), NUM_TRANSACTIONS_TO_SHOW),
    inProgress: groups.donateInProgress,
    shareUrl: window.location.href,
    profileForm: form.profile,
    donationForm: form.donation,
    showUserForm: users.showUserForm || false,
    saveInProgress: users.updateInProgress,
    isAuthenticated: session.isAuthenticated,
    paypalIsDone: query.status === 'payment_success' && !!newUserId,
    newUser,
    hasFullAccount: newUser.hasFullAccount || false,
    i18n
  };
}