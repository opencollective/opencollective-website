import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// Containers
import Notification from './Notification';

// components
import CollectiveLedger from '../components/collective/CollectiveLedger';
import PublicFooter from '../components/PublicFooter';

// actions
import fetchPendingExpenses from '../actions/expenses/fetch_pending_by_collective';
import fetchTransactions from '../actions/transactions/fetch_by_collective';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective
import notify from '../actions/notification/notify';
import validateSchema from '../actions/form/validate_schema';

// Selectors
import {
  getI18nSelector,
  getPopulatedCollectiveSelector } from '../selectors/collectives';
import { getAppRenderedSelector } from '../selectors/app';
import { 
  getUsersSelector } from '../selectors/users';
import { isSessionAuthenticatedSelector } from '../selectors/session';


export class Ledger extends Component {

  render() {
    const { collective } = this.props;
    return (
      <div className='Collective'>
        <Notification />
        <h2> {collective.name} </h2>
        <CollectiveLedger {...this.props} hasHost={ false } itemsToShow ={ 100 }/>
        <PublicFooter />
      </div>
    );

  }

  componentWillMount() {
    const { 
      collective,
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
      fetchTransactions(collective.slug)
      ]);
  }
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getPopulatedCollectiveSelector,

    // other props
    isAuthenticated: isSessionAuthenticatedSelector,
    i18n: getI18nSelector,
    loadData: getAppRenderedSelector,
    users: getUsersSelector
  });

export default connect(mapStateToProps, {
  fetchPendingExpenses,
  fetchTransactions,
  fetchProfile,
  fetchUsers,
  notify,
  validateSchema
})(Ledger);

Ledger.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
}