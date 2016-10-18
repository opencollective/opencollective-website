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
import appendEditCollectiveForm from '../actions/form/append_edit_collective';
import cancelEditCollectiveForm from '../actions/form/cancel_edit_collective';
import fetchExpenses from '../actions/expenses/fetch_by_group'; // TODO: change to collective
import fetchDonations from '../actions/donations/fetch_by_group'; // TODO: change to collective
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective
import notify from '../actions/notification/notify';
import updateCollective from '../actions/groups/update'; // TODO: change to collective
import validateSchema from '../actions/form/validate_schema';

// Selectors
import {
  canEditCollectiveSelector,
  getCollectiveSelector,
  getCollectiveSettingsSelector,
  getI18nSelector,
  getPopulatedCollectiveSelector,
  getSlugSelector,
  hasHostSelector } from '../selectors/collectives';
import {
  getEditCollectiveFormAttrSelector,
  getEditCollectiveInProgress } from '../selectors/form';
import { getAppRenderedSelector } from '../selectors/app';

// Schemas
import editCollectiveSchema from '../joi_schemas/editCollective';


export class Collective extends Component {

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

          {editCollectiveInProgress && <EditTopBar onSave={ saveGroup.bind(this) } onCancel={ cancelEditCollectiveForm }/>}

          <CollectiveHero {...this.props} />
          <CollectiveLedger {...this.props} />
          <CollectiveAboutUs {...this.props} />
          <CollectiveMembers {...this.props} />
          <CollectiveContributorMosaic contributors={ collective.contributors } i18n={i18n}/>
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
      fetchExpenses,
      fetchDonations
    } = this.props;

    if (!collective.name) { // useful when not server-side rendered
      fetchProfile(collective.slug);
    }
    Promise.all([
      fetchUsers(collective.slug),
      fetchExpenses(collective.slug),
      fetchDonations(collective.slug)]);
  }

  componentWillMount() {

  }

}

export function saveGroup() {
  const {
    collective,
    updateCollective,
    editCollectiveForm,
    fetchProfile,
    cancelEditCollectiveForm,
    notify,
    validateSchema
  } = this.props;

  return validateSchema(editCollectiveForm.attributes, editCollectiveSchema)
    .then(() => updateCollective(collective.slug, editCollectiveForm.attributes))
    .then(() => merge(collective, editCollectiveForm.attributes)) // this is to prevent ui from temporarily reverting to old text
    .then(() => cancelEditCollectiveForm()) // clear out this form to prevent data issues on another page.
    .then(() => fetchProfile(group.slug))
    .then(() => notify('success', 'Group updated'))
    .catch(({message}) => notify('error', message));
}

Collective.propTypes = {
  // TODO: list all proptypes
  collective: PropTypes.object,
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getPopulatedCollectiveSelector,
    hasHost: hasHostSelector,
    // Editing props
    canEditCollective: canEditCollectiveSelector,
    editCollectiveForm: getEditCollectiveFormAttrSelector,
    editCollectiveInProgress: getEditCollectiveInProgress,
    // other props
    i18n: getI18nSelector,
    loadData: getAppRenderedSelector

    // TODO: handle paypal donations
  });

export default connect(mapStateToProps, {
  appendEditCollectiveForm,
  cancelEditCollectiveForm,
  fetchExpenses,
  fetchDonations,
  fetchProfile,
  fetchUsers,
  notify,
  updateCollective,
  validateSchema,
})(Collective);
