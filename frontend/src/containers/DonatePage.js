import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import filterCollection from '../lib/filter_collection';
import formatCurrency from '../lib/format_currency';

import roles from '../constants/roles';
import PublicTopBar from '../components/PublicTopBar';
import Notification from '../components/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import Metric from '../components/Metric';
import UsersList from '../components/UsersList';
import ShareIcon from '../components/ShareIcon';
import Icon from '../components/Icon';
import DisplayUrl from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Tiers from '../components/Tiers';

import fetchGroup from '../actions/groups/fetch_by_id';
import fetchUsers from '../actions/users/fetch_by_group';
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

export class DonatePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
  }

  render() {
    const {
      amount,
      interval,
      group,
      shareUrl,
      users,
      isAuthenticated,
      donationForm
    } = this.props;

    const tiers = [{
      name: "custom",
      title: " ",
      description: "Your donation will help us continue our activities. Thank you for your support",
      amount,
      interval: interval || 'one-time',
      range: [amount, 10000000]
    }];
    
    var donationSection;
    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm)) { // we don't handle userform from logged in users) {
      donationSection = <PublicGroupThanks />;
    } else if (this.state.showUserForm) {
      donationSection = <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
    } else {
      donationSection = <Tiers tiers={tiers} {...this.props} form={donationForm} onToken={donateToGroup.bind(this)} />
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

          <center>
            {donationSection}
          </center>
          
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchUsers,
      fetchGroup
    } = this.props;

    fetchGroup(group.id);

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
    fetchUsers
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
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  logout,
  validateDonationProfile,
  decodeJWT,
  appendDonationForm
})(DonatePage);

function mapStateToProps({
  router,
  groups,
  form,
  notification,
  users,
  session
}) {

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

  return {
    amount: router.params.amount,
    interval: router.params.interval,
    group,
    notification,
    users,
    session,
    inProgress: groups.donateInProgress,
    shareUrl: window.location.href,
    profileForm: form.profile,
    donationForm: form.donation,
    showUserForm: users.showUserForm || false,
    saveInProgress: users.updateInProgress,
    isAuthenticated: session.isAuthenticated
  };
}