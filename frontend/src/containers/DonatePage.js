import React, { Component } from 'react';

import { connect } from 'react-redux';

import Notification from '../containers/Notification';
import PostDonationSignUp from '../components/collective/CollectivePostDonationUserSignup';
import PostDonationThanks from '../components/collective/CollectivePostDonationThanks';
import getSocialMediaAvatars from '../actions/users/get_social_media_avatars';
import Tiers from '../components/Tiers';
import getTier from '../lib/tiers';

import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective

import donate from '../actions/groups/donate';
import notify from '../actions/notification/notify';
import appendDonationForm from '../actions/form/append_donation';
import appendProfileForm from '../actions/form/append_profile';
import updateUser from '../actions/users/update';
import validateSchema from '../actions/form/validate_schema';
import uploadImage from '../actions/images/upload';

import profileSchema from '../joi_schemas/profile';
import formatCurrency from '../lib/format_currency';

// Selectors
import { createStructuredSelector } from 'reselect';
import { getTierSelector, getParamsSelector } from '../selectors/router';

import {
  getI18nSelector,
  getCollectiveSelector,
  getCollectiveHostSelector,
  isHostOfCollectiveSelector } from '../selectors/collectives';
import {
  getDonationFormSelector,
  getProfileFormAttrSelector } from '../selectors/form';
import { getAppRenderedSelector } from '../selectors/app';
import { 
  getUsersSelector,
  getNewUserSelector,
  getUpdateInProgressSelector } from '../selectors/users';
import { isSessionAuthenticatedSelector, getAuthenticatedUserSelector } from '../selectors/session';


export class DonatePage extends Component {

  constructor(props) {
    super(props);
    this.state = { view: 'default' };
  }

  render() {
    const {
      collective,
      host,
      donationForm,
      i18n
    } = this.props;

    const { view } = this.state;

    const tier = (this.props.tier.description)  ? this.props.tier : getTier(this.props.tier, collective.tiers) || this.props.tier;
    const intervalString = (tier.interval && tier.interval !== 'one-time') ? `/${tier.interval}` : '';
    tier.button = tier.button || `${this.props.params.verb} ${formatCurrency(tier.amount * 100, collective.currency, { precision: 0 })}${intervalString}`;

    const collectiveHandle = (collective.twitterHandle) ? `@${collective.twitterHandle}` : collective.name;
    const url = window ? window.location.href : '';
    const forDescription = tier.description ? ` for ${tier.description}` : '';
    const tweet = `🎉 I've just donated ${formatCurrency(tier.amount * 100, collective.currency, { precision: 0 })} to ${collectiveHandle}${forDescription} ${url}`;

    if (!tier.name || tier.presets && tier.presets.length > 1) {
      Object.assign(tier, {
      name: "custom",
      title: " ",
      description: tier.description || i18n.getString('defaultTierDescription'),
      range: [tier.amount, 10000000],
      tweet
      });
    }
    const tiers = [tier];
    collective.backers = []; // We don't show the backers

    return (
      <div className='DonatePage Page'>
        <Notification />
          <div className='CollectiveDonationFlowWrapper'>
            <div>
            { view === 'default' &&
                <div className="DonatePage-header">
                  <a href={`/${collective.slug}`}>
                    <div className='DonatePage-logo' style={{backgroundImage: `url(${collective.logo ? collective.logo : '/public/images/rocket.svg'})`}}></div>
                  </a>
                  <div className='DonatePage-line1'>Hi! We are  <a href={`/${collective.slug}`}>{ collective.name }</a>.</div>
                  {collective.mission ? <div className='DonatePage-line2'>{ collective.mission }</div> : null}
                </div>
            }
            { view === 'default' &&
              <Tiers
                tiers={tiers}
                collective={collective}
                host={host}
                donationForm={donationForm}
                appendDonationForm={appendDonationForm}
                onToken={donateToCollective.bind(this)}
                i18n={i18n}
              />
            }
            { view === 'signup' &&
              <PostDonationSignUp {...this.props} onSave={saveNewUser.bind(this)} onSkip={onSkipSaveUser.bind(this)} {...this.props} />
            }
            { view === 'thankyou' &&
              <PostDonationThanks i18n={i18n} collective={collective} message={i18n.getString('thankyou')} tweet={tier.tweet} showRelated={false} closeDonationFlow={this.closeDonationFlow.bind(this)} />
            }
            { view === 'default' &&
              <div className="LightFooter">
                <a href="/">
                  <div className="logo">
                    <svg width='14' height='14' className='inline-block align-middle mr1'>
                      <use xlinkHref='#svg-isotype' fill='#7FADF2'/>
                    </svg>
                    <svg width='138' height='20' className='inline-block align-middle'>
                      <use xlinkHref='#svg-logotype' fill='#919699'/>
                    </svg>
                  </div>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  closeDonationFlow() {
    const  { collective } = this.props;
    window.location = `/${collective.slug}`;
  }

  componentWillMount() {
    const {
      collective,
      fetchUsers
    } = this.props;
    return fetchUsers(collective.slug);
  }

}

export function donateToCollective({amount, interval, currency, description, token}) {
  const {
    notify,
    donate,
    collective
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

  return donate(collective.slug, payment)
    .then(({json}) => afterDonate.bind(this)(json))
    .catch((err) => notify('error', err.message));
}

export function onSkipSaveUser() {
  close.bind(this)();
}

export function afterDonate(donation) {
  this.donation = donation;
  if (donation && donation.user.firstName && donation.user.avatar) {
    close.bind(this)();
  } else {
    this.setState({ view: 'signup' });
  }
}

export function close() {
  const params = this.props.location.query;
  const redirect = this.props.redirect || function(url) {
    window.location = url
  };

  if (params.redirect) {
    redirect(`${params.redirect}?transactionuuid=${this.donation.transaction.uuid}`);
  } else {
    this.setState({ view: 'thankyou' });
  }
}

export function saveNewUser() {
 const {
    newUser,
    updateUser,
    profileForm,
    validateSchema,
    notify
  } = this.props;
  return validateSchema(profileForm.attributes, profileSchema)
    .then(() => updateUser(newUser.id, Object.assign({}, profileForm)))
    .then(close.bind(this))
    .catch(({message}) => notify('error', message));
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getCollectiveSelector,
    host: getCollectiveHostSelector,
    isHost: isHostOfCollectiveSelector,

    // donation props
    donationForm: getDonationFormSelector,
    profileForm: getProfileFormAttrSelector,
    newUser: getNewUserSelector,
    updateInProgress: getUpdateInProgressSelector,

    // other props
    isAuthenticated: isSessionAuthenticatedSelector,
    i18n: getI18nSelector,
    loadData: getAppRenderedSelector,
    users: getUsersSelector,
    loggedinUser: getAuthenticatedUserSelector,
    tier: getTierSelector,
    params: getParamsSelector
  });

export default connect(mapStateToProps, {
  appendDonationForm,
  appendProfileForm,
  donate,
  fetchUsers,
  getSocialMediaAvatars,
  notify,
  updateUser,
  uploadImage,
  validateSchema
})(DonatePage);

