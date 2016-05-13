import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import i18n from '../lib/i18n';

import roles from '../constants/roles';
import Notification from '../containers/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/PublicGroupThanks';
import DisplayUrl from '../components/DisplayUrl';
import PublicGroupSignup from '../components/PublicGroupSignup';
import Tiers from '../components/Tiers';

import fetchGroup from '../actions/groups/fetch_by_id';
import fetchUsers from '../actions/users/fetch_by_group';
import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update';
import validateSchema from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';

import profileSchema from '../joi_schemas/profile';

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
      isAuthenticated,
      donationForm,
      i18n
    } = this.props;

    const tiers = [{
      name: "custom",
      title: " ",
      description: i18n.getString('defaultTierDescription'),
      amount,
      interval: interval || 'one-time',
      range: [amount, 10000000]
    }];

    var donationSection;
    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm)) { // we don't handle userform from logged in users) {
      donationSection = <PublicGroupThanks message={i18n.getString('thankyou')} />;
    } else if (this.state.showUserForm) {
      donationSection = <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
    } else {
      donationSection = <Tiers tiers={tiers} {...this.props} form={donationForm} onToken={donateToGroup.bind(this)} />
    }

    return (
      <div className='DonatePage'>
        <Notification />

        <div className='PublicContent'>

          <div className='PublicGroupHeader'>
            <img className='PublicGroupHeader-logo' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
            <div className='PublicGroupHeader-website'><DisplayUrl url={group.website} /></div>
            <div className='PublicGroupHeader-host'>{i18n.getString('hostedBy')} <a href={group.host.website}>{group.host.name}</a></div>
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

export function donateToGroup({amount, frequency, currency, token}) {
  const {
    notify,
    donate,
    group,
    fetchGroup,
    fetchUsers
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
    .catch((err) => notify('error', err.message));
}

export function saveNewUser() {
 const {
    users,
    updateUser,
    profileForm,
    validateSchema,
    notify,
    group,
    fetchUsers
  } = this.props;
  return validateSchema(profileForm.attributes, profileSchema)
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
  fetchUsers,
  fetchGroup,
  appendProfileForm,
  updateUser,
  validateSchema,
  decodeJWT,
  appendDonationForm
})(DonatePage);

function mapStateToProps({
  router,
  groups,
  form,
  users,
  session
}) {

  const group = values(groups)[0] || {stripeAccount: {}}; // to refactor to allow only one group
  const usersByRole = group.usersByRole || {};
  const newUser = users.newUser || {};

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

  group.settings = group.settings || {
    lang: 'en',
    formatCurrency: {
      compact: false,
      precision: 2
    }
  };

  return {
    amount: router.params.amount,
    interval: router.params.interval,
    group,
    users,
    session,
    inProgress: groups.donateInProgress,
    shareUrl: window.location.href,
    profileForm: form.profile,
    donationForm: form.donation,
    showUserForm: users.showUserForm || false,
    saveInProgress: users.updateInProgress,
    isAuthenticated: session.isAuthenticated,
    newUser,
    i18n: i18n(group.settings.lang)
  };
}