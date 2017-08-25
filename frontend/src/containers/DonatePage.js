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

    this.prepareTweet = this.prepareTweet.bind(this);

    const { collective, i18n } = props;
    this.state = { view: 'default' };
    this.tier = (this.props.tier.description) ? this.props.tier : getTier(this.props.tier, collective.tiers) || this.props.tier;
    const verb = this.props.params.verb || 'donate';
    console.log(">>> this.tier", this.tier, "this.props", this.props, "collective.tiers", collective.tiers, "getTier", getTier(this.props.tier, collective.tiers));
    if (!this.tier.name || this.tier.presets && this.tier.presets.length > 1) {
      Object.assign(this.tier, {
      name: "custom",
      title: " ",
      description: this.tier.description || i18n.getString('defaultTierDescription'),
      range: [this.tier.amount || 0, 10000000]
      });
    }

    if (!this.tier.amount) {
      Object.assign(this.tier, {
        presets: ["other", 5, 10, 50, 100],
        interval: 'one-time',
        amount: 20,
        verb
      });
    } else {
      const intervalString = (this.tier.interval && this.tier.interval !== 'one-time') ? `/${this.tier.interval}` : '';
      this.tier.button = this.tier.button || `${verb} ${formatCurrency(this.tier.amount * 100, collective.currency, { precision: 0 })}${intervalString}`;    
    }

    this.tiers = [this.tier];

  }

  prepareTweet(amount) {
    const { collective } = this.props;
    const collectiveHandle = (collective.twitterHandle) ? `@${collective.twitterHandle}` : collective.name;
    const url = window ? window.location.href : '';
    const forDescription = this.tier.description ? ` for ${this.tier.description}` : '';
    return `🎉 I've just donated ${formatCurrency(amount * 100, collective.currency, { precision: 0 })} to ${collectiveHandle}${forDescription} ${url}`;
  }

  render() {
    const {
      collective,
      host,
      donationForm,
      appendDonationForm,
      i18n
    } = this.props;

    const { view } = this.state;

    collective.backers = []; // We don't show the backers

    const currentAmount = (donationForm.custom && donationForm.custom.amount) || this.tier.amount;

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
                tiers={this.tiers}
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
              <PostDonationThanks i18n={i18n} collective={collective} message={i18n.getString('thankyou')} tweet={this.prepareTweet(currentAmount)} showRelated={false} closeDonationFlow={this.closeDonationFlow.bind(this)} />
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
    amount: amount*100,
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

