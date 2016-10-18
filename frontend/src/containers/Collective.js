import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import { createStructuredSelector } from 'reselect';
import merge from 'lodash/merge';

// Containers
import Notification from './Notification';

// Components
import CollectiveAboutUs from '../components/collective/CollectiveAboutUs';
import CollectiveHero from '../components/collective/CollectiveHero';
import CollectiveLedger from '../components/collective/CollectiveLedger';
import CollectiveMembersWall from '../components/collective/CollectiveMembersWall';
import EditTopBar from '../components/EditTopBar';
import PublicFooter from '../components/PublicFooter';

// Actions
import appendEditCollectiveForm from '../actions/form/append_edit_collective';
import cancelEditCollectiveForm from '../actions/form/cancel_edit_collective';
import fetchCollective from '../actions/groups/fetch_by_slug'; // TODO: change to collective
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
      cancelEditCollectiveForm
    } = this.props;

    return (
      <div className='Collective'>
        <Notification />
        <StickyContainer>

          {editCollectiveInProgress && <EditTopBar onSave={ saveGroup.bind(this) } onCancel={ cancelEditCollectiveForm }/>}

          <CollectiveHero {...this.props} />
          {false && <CollectiveLedger {...this.props} />}
          <CollectiveAboutUs {...this.props} />
          {false && <CollectiveMembersWall {...this.props} />}

          <PublicFooter />
        </StickyContainer>
      </div>
    );
  }

  componentDidMount() {
    const {
      collective,
      fetchCollective,
      fetchUsers,
    } = this.props;

    if (!collective.name) {
      fetchCollective(collective.slug);
    }
    if (!collective.usersByRole) {
      fetchUsers(collective.slug);
    }
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
  fetchProfile,
  fetchUsers,
  notify,
  updateCollective,
  validateSchema,
})(Collective);
