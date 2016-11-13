import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// Containers
import LoginTopBar from './LoginTopBar';
import Notification from './Notification';

// components
import CollectiveLedger from '../components/collective/CollectiveLedger';
import Currency from '../components/Currency';
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
      <div className='Ledger'>
        <LoginTopBar />
        <Notification />

        <div className='Ledger-container padding40' style={{marginBottom: '0'}}>
          <div className='line1'>collective information</div>
          <div className='info-block mr3'>
            <div className='info-block-value'>{collective.name}</div>
            <div className='info-block-label'>collective</div>
          </div>
          <div className='info-block'>
            <div className='info-block-value'>
              <Currency value={collective.balance} currency={collective.currency} precision={2} />
            </div>
            <div className='info-block-label'>funds</div>
          </div>
        </div>

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