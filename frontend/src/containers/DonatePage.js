import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/values';
import i18n from '../lib/i18n';

import roles from '../constants/roles';
import Notification from '../containers/Notification';
import PublicFooter from '../components/PublicFooter';
import PublicGroupThanks from '../components/public_group/PublicGroupThanksV2';
import getSocialMediaAvatars from '../actions/users/get_social_media_avatars';
import PublicGroupSignup from '../components/public_group/PublicGroupSignupV2';
import Tiers from '../components/Tiers';
import getTier from '../lib/tiers';

import fetchGroup from '../actions/groups/fetch_by_slug';
import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update';
import validateSchema from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';

import profileSchema from '../joi_schemas/profile';
import formatCurrency from '../lib/format_currency';

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
      description,
      group,
      isAuthenticated,
      donationForm,
      i18n
    } = this.props;

    let tier = getTier({amount, interval}, group.tiers);
    const groupHandle = (group.twitterHandle) ? `@${group.twitterHandle}` : group.name;
    const url = window ? window.location.href : '';
    const forDescription = description ? ` for ${description}` : '';
    const tweet = `🎉 I've just donated ${formatCurrency(amount * 100, group.currency, { precision: 0 })} to ${groupHandle}${forDescription} ${url}`;

    if (!tier || tier.presets && tier.presets.length > 1)
      tier = {
      name: "custom",
      title: " ",
      description: description || i18n.getString('defaultTierDescription'),
      amount,
      interval: interval || 'one-time',
      range: [amount, 10000000],
      tweet
    };
    const tiers = [tier];

    group.backers = []; // We don't show the backers

    let showHeader = true, view = 'default';
    if (this.state.showThankYouMessage || (isAuthenticated && this.state.showUserForm)) { // we don't handle userform from logged in users) {
      view = 'thankyou';
      showHeader = false;
    } else if (this.state.showUserForm) {
      view = 'signup';
      showHeader = false;      
    }

    return (
      <div className='DonatePage Page'>
        <Notification />
        <div className="Page-container">
          { showHeader &&
            <div className="DonatePage-header">
              <a href={`/${group.slug}`}>
                <div className='DonatePage-logo' style={{backgroundImage: `url(${group.logo ? group.logo : '/static/images/rocket.svg'})`}}></div>
              </a>
              <div className='DonatePage-line1'>Hi! We are  <a href={`/${group.slug}`}>{ group.name }</a>.</div>
              {group.mission ? <div className='DonatePage-line2'>{ group.mission }</div> : null}
            </div>
          }
          <div className='DonatePage-donation-container'>
            { view === 'thankyou' &&
              <PublicGroupThanks i18n={i18n} group={group} message={i18n.getString('thankyou')} tweet={tier.tweet} />
            }
            { view === 'signup' &&
              <PublicGroupSignup {...this.props} save={saveNewUser.bind(this)} />
            }
            { view === 'default' &&
              <Tiers tiers={tiers} {...this.props} form={donationForm} onToken={donateToGroup.bind(this)} />
            }
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchGroup
    } = this.props;

    fetchGroup(group.slug);
  }

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
  }
}

export function donateToGroup({amount, interval, currency, description, token}) {
  const {
    notify,
    donate,
    group
  } = this.props;

  const payment = {
    stripeToken: token && token.id,
    email: token && token.email,
    amount,
    currency,
    description
  };

  if (interval !== 'one-time')
    payment.interval = interval;

  return donate(group.id, payment)
    .then(({json}) => {
      if (json && !json.hasFullAccount) {
        this.setState({ showUserForm: true })
      } else {
        this.setState({ showThankYouMessage: true })
      }
    })
    .catch((err) => notify('error', err.message));
}

export function saveNewUser() {
 const {
    users,
    updateUser,
    profileForm,
    validateSchema,
    notify
  } = this.props;
  return validateSchema(profileForm.attributes, profileSchema)
    .then(() => updateUser(users.newUser.id, profileForm.attributes))
    .then(() => this.setState({
      showUserForm: false,
      showThankYouMessage: true
    }))
    .catch(({message}) => notify('error', message));
}

export default connect(mapStateToProps, {
  donate,
  notify,
  fetchGroup,
  appendProfileForm,
  updateUser,
  validateSchema,
  getSocialMediaAvatars,
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

  let { interval = 'one-time', description } = router.params;
  if (interval.match(/^month(ly)?$/i)) {
    interval = 'month';
  } else if (interval.match(/^year(ly)?$/i)) {
    interval = 'year';
  } else if (interval !== 'one-time') {
    description = interval;
    interval = 'one-time';
  }

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
  group.settings = group.settings || { lang: 'en' };
  group.settings.formatCurrency = group.settings.formatCurrency || { compact: false, precision: 2 };

  return {
    amount: router.params.amount,
    interval,
    description,
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
