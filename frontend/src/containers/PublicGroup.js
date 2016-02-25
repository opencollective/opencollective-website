import React, { Component } from 'react';

import { connect } from 'react-redux';
import take from 'lodash/array/take';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import filterCollection from '../lib/filter_collection';
import formatCurrency from '../lib/format_currency';

import roles from '../constants/roles';
import PublicTopBar from '../components/PublicTopBar';
import Notification from '../components/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import TransactionItem from '../components/TransactionItem';
import YoutubeVideo from '../components/YoutubeVideo';
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
import resetNotifications from '../actions/notification/reset';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update_user';
import validateDonationProfile from '../actions/form/validate_donation_profile';
import logout from '../actions/session/logout';
import decodeJWT from '../actions/session/decode_jwt';

// Number of expenses and revenue items to show on the public page
const NUM_TRANSACTIONS_TO_SHOW = 3;

const Media = ({group}) => {
  if (group.video) {
      return (
        <div className='PublicGroup-video'>
          <YoutubeVideo video={group.video} />
        </div>
      );
  } else if (group.image) {
    return (
      <div className='PublicGroup-image'>
        <img src={group.image} />
      </div>
    );
  } else {
    return (
      <div className='PublicGroup-image'>
        <div className='PublicGroup-image-placeholder'/>
      </div>
    );
  }
};

export class PublicGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
  }

  render() {
    const {
      group,
      donations,
      expenses,
      shareUrl,
      users,
      isAuthenticated,
      donationForm
    } = this.props;

    var donationSection;
    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm)) { // we don't handle userform from logged in users) {
      donationSection = <PublicGroupThanks />;
    } else if (this.state.showUserForm) {
      donationSection = <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
    } else {
      donationSection = <Tiers tiers={group.tiers} {...this.props} form={donationForm} onToken={donateToGroup.bind(this)} />
    }
    return (
      <div className='PublicGroup'>

        <PublicTopBar session={this.props.session} logout={this.props.logout} slug={group.slug}/>
        <Notification {...this.props} />

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
          {donationSection}

          <div className='PublicGroup-transactions'>
            <div className='PublicGroup-expenses'>
              <h2>Expenses</h2>
              {(expenses.length === 0) && (
                <div className='PublicGroup-emptyState'>
                  <div className='PublicGroup-expenseIcon'>
                    <Icon type='expense' />
                  </div>
                  <label>
                    All your approved expenses will show up here
                  </label>
                </div>
              )}
              {expenses.map(expense => <TransactionItem
                                          key={expense.id}
                                          transaction={expense}
                                          user={users[expense.UserId]} />)}
            </div>

            <div className='PublicGroup-donations'>
              <h2>Revenue</h2>
              {(donations.length === 0) && (
                <div className='PublicGroup-emptyState'>
                  <div className='PublicGroup-donationIcon'>
                    <Icon type='revenue' />
                  </div>
                  <label>
                    All your latest donations will show up here
                  </label>
                </div>
              )}
              {donations.map(donation => <TransactionItem
                                            key={donation.id}
                                            transaction={donation}
                                            user={users[donation.UserId]} />)}
            </div>
          </div>

        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
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

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
  }
}

export function donateToGroup(amount, frequency, currency, token) {
  const {
    notify,
    donate,
    group,
    fetchGroup,
    fetchUsers,
    fetchTransactions
  } = this.props;

  const payment = {
    stripeToken: token.id,
    email: token.email,
    amount,
    currency
  };

  if (frequency === 'monthly') {
    payment.interval = 'month';
  } else if (frequency === 'yearly') {
    payment.interval = 'year';
  }

  return donate(group.id, payment)
    .then(({json}) => {
      if (json && !json.hasFullAccount) {
        this.setState({ showUserForm: true })
      } else {
        this.setState({ showThankYouMessage: true })
      }
    })
    .then(() => fetchGroup(group.id))
    .then(() => fetchUsers(group.id))
    .then(() => {
      return fetchTransactions(group.id, {
        per_page: NUM_TRANSACTIONS_TO_SHOW,
        sort: 'createdAt',
        direction: 'desc',
        donation: true
      });
    })
    .catch((err) => notify('error', err.message));
}

export function saveNewUser() {
 const {
    users,
    updateUser,
    profileForm,
    validateDonationProfile,
    notify,
    group,
    fetchUsers
  } = this.props;

  return validateDonationProfile(profileForm.attributes)
    .then(() => updateUser(users.newUser.id, profileForm.attributes))
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
  resetNotifications,
  fetchTransactions,
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  logout,
  validateDonationProfile,
  decodeJWT,
  appendDonationForm
})(PublicGroup);

function mapStateToProps({
  groups,
  form,
  notification,
  transactions,
  users,
  session
}) {

  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group

  /* @xdamman:
   * We should refactor this. The /api/group route should directly return
   * group.host, group.backers, group.members, group.donations, group.expenses
   */
  group.id = Number(group.id);
  group.host = filterCollection(users, { role: roles.HOST })[0] || {};
  group.members = filterCollection(users, { role: roles.MEMBER }) || [];
  group.backers = filterCollection(users, { role: roles.BACKER }) || [];
  group.backersCount = group.backers.length;
  group.transactions = filterCollection(transactions, { GroupId: group.id });

  const donations = group.transactions.filter(({amount}) => amount > 0);
  const expenses = group.transactions.filter(({amount}) => amount < 0);

  return {
    group,
    notification,
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
    isAuthenticated: session.isAuthenticated
  };
}