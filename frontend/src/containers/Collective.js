import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'redux-router';
import { StickyContainer } from 'react-sticky';
import { createStructuredSelector } from 'reselect';
import merge from 'lodash/merge';

// Containers
import Notification from './Notification';

// Components
import CollectiveAboutUs from '../components/collective/CollectiveAboutUs';
import CollectiveContributorMosaic from '../components/collective/CollectiveContributorMosaic';
import CollectiveDonate from '../components/collective/CollectiveDonate';
import CollectiveHero from '../components/collective/CollectiveHero';
import CollectiveLedger from '../components/collective/CollectiveLedger';
import CollectiveMembers from '../components/collective/CollectiveMembers';
import CollectivePostDonationThanks from '../components/collective/CollectivePostDonationThanks';
import CollectivePostDonationUserSignup from '../components/collective/CollectivePostDonationUserSignup';
import EditTopBar from '../components/EditTopBar';
import PublicFooter from '../components/PublicFooter';

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
import validateSchema from '../actions/form/validate_schema';

// Selectors
import {
  canEditCollectiveSelector,
  getI18nSelector,
  getPopulatedCollectiveSelector,
  isHostOfCollectiveSelector,
  hasHostSelector } from '../selectors/collectives';
import {
  getEditCollectiveFormAttrSelector,
  getEditCollectiveInProgressSelector,
  getDonationFormSelector,
  getProfileFormAttrSelector } from '../selectors/form';
import { getAppRenderedSelector } from '../selectors/app';
import { 
  getUsersSelector,
  getNewUserSelector,
  getUpdateInProgressSelector } from '../selectors/users';
import { isSessionAuthenticatedSelector } from '../selectors/session';

// Schemas
import editCollectiveSchema from '../joi_schemas/editCollective';
import profileSchema from '../joi_schemas/profile';


export class Collective extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showThankYouMessage: false,
      showUserForm: false
    };
  }

  render() {
    const {
      collective,
      editCollectiveInProgress,
      cancelEditCollectiveForm,
      i18n,
      hasHost
    } = this.props;

    return (
      <div className='Collective'>
        <Notification />
        <StickyContainer>

          {editCollectiveInProgress && 
            <EditTopBar onSave={ saveCollective.bind(this) } onCancel={ cancelEditCollectiveForm }/>}

          <CollectiveHero { ...this.props } />
          <CollectiveLedger { ...this.props } />

          {hasHost && <CollectiveDonate onDonate={ donateToCollective.bind(this) } { ...this.props }/>}

          <CollectiveAboutUs { ...this.props } />
          <CollectiveMembers collective={ collective } i18n={ i18n } />
          {collective.contributors && <CollectiveContributorMosaic collective={collective} i18n={i18n} />}
          
          {this.state.showThankYouMessage && 
            <CollectivePostDonationThanks closeDonationFlow={ ::this.closeDonationFlow } { ...this.props } />}
          {this.state.showUserForm && 
            <CollectivePostDonationUserSignup closeDonationFlow={ ::this.closeDonationFlow } save={ saveNewUser.bind(this) } { ...this.props } />}

          <PublicFooter />
        </StickyContainer>
      </div>
    );
  }

  componentDidMount() {
    const {
      collective,
      fetchProfile,
      loadData
    } = this.props;

    if (loadData) { // useful when not server-side rendered
      fetchProfile(collective.slug);
    }
    this.refreshData();
  }

  componentWillMount() {
  }
    
  closeDonationFlow() {
    return this.refreshData()
      .then(() => this.setState({
                    showThankYouMessage: false,
                    showUserForm: false }));
    
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
      fetchTransactions(collective.slug)]);
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
export function donateToCollective({amount, frequency, currency, token, options}) {
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

  if (frequency === 'monthly') {
    payment.interval = 'month';
  } else if (frequency === 'yearly') {
    payment.interval = 'year';
  }

  return donate(collective.slug, payment, options)
    .then(() => this.setState({
        showUserForm: !this.props.hasFullAccount,
        showThankYouMessage: this.props.hasFullAccount
      }))
    .catch((err) => notify('error', err.message));
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
    .then(() => this.setState({
      showUserForm: false,
      showThankYouMessage: true
    }))
    .then(() => fetchUsers(collective.slug))
    .catch(({message}) => notify('error', message));
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getPopulatedCollectiveSelector,
    hasHost: hasHostSelector,

    // donation props
    donationForm: getDonationFormSelector,
    profileForm: getProfileFormAttrSelector,
    newUser: getNewUserSelector,
    updateInProgress: getUpdateInProgressSelector,

    // editing props
    canEditCollective: canEditCollectiveSelector,
    editCollectiveForm: getEditCollectiveFormAttrSelector,
    editCollectiveInProgress: getEditCollectiveInProgressSelector,
    isHost: isHostOfCollectiveSelector,

    // other props
    isAuthenticated: isSessionAuthenticatedSelector,
    i18n: getI18nSelector,
    loadData: getAppRenderedSelector,
    users: getUsersSelector
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
  validateSchema
})(Collective);


Collective.propTypes = {
  // TODO: list all proptypes
  collective: PropTypes.object.isRequired,
}
