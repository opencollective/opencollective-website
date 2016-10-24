import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import { createStructuredSelector } from 'reselect';
import merge from 'lodash/merge';

// Containers
import Notification from './Notification';

// Components
import CollectiveAboutUs from '../components/collective/CollectiveAboutUs';
import CollectiveContributorMosaic from '../components/collective/CollectiveContributorMosaic';
import CollectiveHero from '../components/collective/CollectiveHero';
import CollectiveLedger from '../components/collective/CollectiveLedger';
import CollectiveMembers from '../components/collective/CollectiveMembers';
import EditTopBar from '../components/EditTopBar';
import PublicFooter from '../components/PublicFooter';

// Actions
import appendDonationForm from '../actions/form/append_donation';
import appendEditCollectiveForm from '../actions/form/append_edit_collective';
import cancelEditCollectiveForm from '../actions/form/cancel_edit_collective';
import donate from '../actions/groups/donate'; // TODO: change to collective
import fetchPendingExpenses from '../actions/expenses/fetch_pending_by_collective';
import fetchTransactions from '../actions/transactions/fetch_by_collective';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective
import notify from '../actions/notification/notify';
import updateCollective from '../actions/groups/update'; // TODO: change to collective
import validateSchema from '../actions/form/validate_schema';

// Selectors
import {
  canEditCollectiveSelector,
  getI18nSelector,
  getPopulatedCollectiveSelector,
  hasHostSelector } from '../selectors/collectives';
import {
  getEditCollectiveFormAttrSelector,
  getEditCollectiveInProgressSelector,
  getDonationFormSelector } from '../selectors/form';
import { getAppRenderedSelector } from '../selectors/app';
import { getUsersSelector } from '../selectors/users';

// Schemas
import editCollectiveSchema from '../joi_schemas/editCollective';


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
      i18n
    } = this.props;

    return (
      <div className='Collective'>
        <Notification />
        <StickyContainer>

          {editCollectiveInProgress && <EditTopBar onSave={ saveCollective.bind(this) } onCancel={ cancelEditCollectiveForm }/>}

          <CollectiveHero {...this.props} />
          <CollectiveLedger donateToCollective={ donateToCollective.bind(this) } {...this.props} />
          <CollectiveAboutUs {...this.props} />
          <CollectiveMembers collective={ collective } i18n={ i18n } />
          <CollectiveContributorMosaic contributors={ collective.contributors } i18n={ i18n } />
          <PublicFooter />
        </StickyContainer>
      </div>
    );
  }

  componentDidMount() {
    const {
      collective,
      fetchProfile,
      fetchUsers,
      fetchPendingExpenses,
      fetchTransactions,
      loadData
    } = this.props;

    if (loadData) { // useful when not server-side rendered
      fetchProfile(collective.slug);
    }
    Promise.all([
      fetchUsers(collective.slug),
      fetchPendingExpenses(collective.slug),
      fetchTransactions(collective.slug)]);
  }

  componentWillMount() {

  }

}

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
    .then(() => {
      // Paypal will redirect to this page and we will refresh at that moment.
      // A Stripe donation on the other hand is immediate after the request:
      if (!(options && options.paypal)) {
        this.setState({
          showUserForm: !this.props.hasFullAccount,
          showThankYouMessage: this.props.hasFullAccount
        });
      }
    })
    .catch((err) => notify('error', err.message));
}

Collective.propTypes = {
  // TODO: list all proptypes
  collective: PropTypes.object,
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getPopulatedCollectiveSelector,
    hasHost: hasHostSelector,

    // donation props
    donationForm: getDonationFormSelector,

    // Editing props
    canEditCollective: canEditCollectiveSelector,
    editCollectiveForm: getEditCollectiveFormAttrSelector,
    editCollectiveInProgress: getEditCollectiveInProgressSelector,

    // other props
    i18n: getI18nSelector,
    loadData: getAppRenderedSelector,
    users: getUsersSelector

    // TODO: handle paypal donations
  });

export default connect(mapStateToProps, {
  appendDonationForm,
  appendEditCollectiveForm,
  cancelEditCollectiveForm,
  donate,
  fetchPendingExpenses,
  fetchTransactions,
  fetchProfile,
  fetchUsers,
  notify,
  updateCollective,
  validateSchema,
})(Collective);
