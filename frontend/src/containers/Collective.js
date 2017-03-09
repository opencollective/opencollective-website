import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import { StickyContainer } from 'react-sticky';
import { createStructuredSelector } from 'reselect';
import merge from 'lodash/merge';
import { capitalize } from '../lib/utils';

// Containers
import Notification from './Notification';

// Components
import CollectiveAboutUs from '../components/collective/CollectiveAboutUs';
import CollectiveDonate from '../components/collective/CollectiveDonate';
import CollectiveHero from '../components/collective/CollectiveHero';
import CollectiveLedger from '../components/collective/CollectiveLedger';
import CollectiveMembers from '../components/collective/CollectiveMembers';
import CollectivePostDonationThanks from '../components/collective/CollectivePostDonationThanks';
import CollectivePostDonationUserSignup from '../components/collective/CollectivePostDonationUserSignup';
import CollectiveOpenSourceCTA from '../components/collective/CollectiveOpenSourceCTA';
import EditTopBar from '../components/EditTopBar';
import PublicFooter from '../components/PublicFooter';
import CollectiveList from '../components/CollectiveList';

// Actions
import appendDonationForm from '../actions/form/append_donation';
import appendEditCollectiveForm from '../actions/form/append_edit_collective';
import appendProfileForm from '../actions/form/append_profile';
import cancelEditCollectiveForm from '../actions/form/cancel_edit_collective';
import donate from '../actions/groups/donate'; // TODO: change to collective
import fetchPendingExpenses from '../actions/expenses/fetch_pending_by_collective';
import fetchTransactions from '../actions/transactions/fetch_by_collective';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective
import getSocialMediaAvatars from '../actions/users/get_social_media_avatars';
import notify from '../actions/notification/notify';
import updateCollective from '../actions/groups/update'; // TODO: change to collective
import updateUser from '../actions/users/update';
import uploadImage from '../actions/images/upload';
import validateSchema from '../actions/form/validate_schema';

// Selectors
import {
  canEditCollectiveSelector,
  getI18nSelector,
  getPopulatedCollectiveSelector,
  getSubCollectivesSelector,
  getCollectiveHostSelector,
  isHostOfCollectiveSelector } from '../selectors/collectives';
import {
  getEditCollectiveFormAttrSelector,
  getEditCollectiveInProgressSelector,
  getDonationFormSelector,
  getProfileFormAttrSelector } from '../selectors/form';
import { 
  getUsersSelector,
  getNewUserSelector,
  getUpdateInProgressSelector } from '../selectors/users';
import { isSessionAuthenticatedSelector, getAuthenticatedUserSelector } from '../selectors/session';
import { getQuerySelector } from '../selectors/router';

// Schemas
import editCollectiveSchema from '../joi_schemas/editCollective';
import profileSchema from '../joi_schemas/profile';


export class Collective extends Component {

  constructor(props) {
    super(props);
    let view = 'default';
    if (this.props.query.status === 'payment_success') {
      view = (this.props.query.has_full_account === 'true') ? 'thankyou' : 'signup';
    }
    this.state = { view };
  }

  render() {
    const {
      collective,
      host,
      subCollectives,
      editCollectiveInProgress,
      cancelEditCollectiveForm,
      donationForm,
      appendDonationForm,
      i18n
    } = this.props;

    return (
      <div className={`Collective ${collective.slug}`}>
        <Notification />

          { this.state.view === 'default' &&
            <StickyContainer>
              {editCollectiveInProgress && 
                <EditTopBar onSave={ saveCollective.bind(this) } onCancel={ cancelEditCollectiveForm }/>}

              <CollectiveHero { ...this.props } />
              <CollectiveLedger { ...this.props } />

              {collective.isActive && 
                <CollectiveDonate
                  collective={collective}
                  host={host}
                  i18n={i18n}
                  donationForm={donationForm}
                  appendDonationForm={appendDonationForm}
                  onToken={donateToCollective.bind(this)}
                />
              }

              <CollectiveAboutUs { ...this.props } />

              {collective.slug === 'opensource' && <CollectiveOpenSourceCTA />}

              {subCollectives  && subCollectives.length > 0 &&
                <section id="collectives">
                  <h1>{capitalize(i18n.getString('collectives'))}</h1>
                  <h2 className="subtitle">{i18n.getString('DiscoverOurCollectives', { tag: collective.settings.superCollectiveTag})}</h2>
                  <CollectiveList title={' '} groupList={ subCollectives } {...this.props} />
                </section>
              }
              <CollectiveMembers collective={ collective } i18n={ i18n } />
              <PublicFooter />
            </StickyContainer>
          }

          {this.state.view === 'signup' && 
            <div className='CollectiveDonationFlowWrapper'>
              <CollectivePostDonationUserSignup onSave={ saveNewUser.bind(this) } onSkip={ onSkipSaveUser.bind(this) } { ...this.props } />
            </div>
          }
          
          {this.state.view === 'thankyou' && 
            <div className='CollectiveDonationFlowWrapper'>
              <CollectivePostDonationThanks closeDonationFlow={ ::this.closeDonationFlow } { ...this.props } />
            </div>
          }

      </div>
    );
  }

  componentWillMount() {
    this.refreshData(); 
  }
    
  closeDonationFlow() {
    return this.refreshData()
      .then(() => this.setState({ view: 'default' }));
  }

  refreshData() {
    const { 
      collective,
      fetchUsers,
      fetchPendingExpenses,
      fetchTransactions
    } = this.props;

    return Promise.all([
      fetchUsers(collective.slug),
      fetchPendingExpenses(collective.slug),
      fetchTransactions(collective.slug)
    ]);
  }
}

/*
 * Save changes to a collective
 */
export function saveCollective() {
  const {
    collective,
    updateCollective,
    editCollectiveForm,
    fetchProfile,
    cancelEditCollectiveForm,
    notify,
    validateSchema
  } = this.props;

  return validateSchema(editCollectiveForm, editCollectiveSchema)
    .then(() => updateCollective(collective.slug, editCollectiveForm))
    .then(() => merge(collective, editCollectiveForm)) // this is to prevent ui from temporarily reverting to old text
    .then(() => cancelEditCollectiveForm()) // clear out this form to prevent data issues on another page.
    .then(() => fetchProfile(collective.slug))
    .then(() => notify('success', 'Collective updated'))
    .catch(({message}) => notify('error', message));
}

/*
 * Receive donation to a collective
 */
export function donateToCollective({amount, interval, currency, token, options}) {
  const {
    notify,
    collective,
    donate,
  } = this.props;

  const payment = {
    stripeToken: token && token.id,
    email: token && token.email,
    amount,
    currency,
    distribution: options && options.distribution
  };

  if (interval && interval !== 'one-time') {
    payment.interval = interval.replace(/ly$/,'');
  }

  return donate(collective.slug, payment, options)
    .then(({json}) => this.setState({ view: (json && json.user.firstName && json.user.avatar) ? 'thankyou' : 'signup' }))
    .catch((err) => notify('error', err.message));
}

export function onSkipSaveUser() {
  this.setState({ view: 'thankyou' });
}

/*
 * Save user profile info post-donation
 */
export function saveNewUser() {
 const {
    collective,
    newUser,
    updateUser,
    profileForm,
    validateSchema,
    notify,
    fetchUsers
  } = this.props;

  return validateSchema(profileForm, profileSchema)
    .then(() => updateUser(newUser.id, Object.assign({}, profileForm)))
    .then(() => this.setState({ view: 'thankyou' }))
    .then(() => fetchUsers(collective.slug))
    .catch(({message}) => notify('error', message));
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getPopulatedCollectiveSelector,
    subCollectives: getSubCollectivesSelector,
    host: getCollectiveHostSelector,
    isHost: isHostOfCollectiveSelector,

    // donation props
    donationForm: getDonationFormSelector,
    profileForm: getProfileFormAttrSelector,
    newUser: getNewUserSelector,
    updateInProgress: getUpdateInProgressSelector,

    // editing props
    canEditCollective: canEditCollectiveSelector,
    editCollectiveForm: getEditCollectiveFormAttrSelector,
    editCollectiveInProgress: getEditCollectiveInProgressSelector,

    // other props
    isAuthenticated: isSessionAuthenticatedSelector,
    i18n: getI18nSelector,
    users: getUsersSelector,
    loggedinUser: getAuthenticatedUserSelector,
    query: getQuerySelector
  });

export default connect(mapStateToProps, {
  appendDonationForm,
  appendEditCollectiveForm,
  appendProfileForm,
  cancelEditCollectiveForm,
  donate,
  fetchPendingExpenses,
  fetchTransactions,
  fetchProfile,
  fetchUsers,
  getSocialMediaAvatars,
  notify,
  push,
  updateCollective,
  updateUser,
  uploadImage,
  validateSchema
})(Collective);


Collective.propTypes = {
  // TODO: list all proptypes
  collective: PropTypes.object.isRequired,
}
