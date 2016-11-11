import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Containers
import Notification from './Notification';
import LoginTopBar from './LoginTopBar';

// components
import CollectiveExpenseDetail from '../components/collective/CollectiveExpenseDetail';
import PublicFooter from '../components/PublicFooter';

// actions
import approveExpense from '../actions/expenses/approve';
import fetchPendingExpenses from '../actions/expenses/fetch_pending_by_collective';
import fetchTransactions from '../actions/transactions/fetch_by_collective';
import fetchProfile from '../actions/profile/fetch_by_slug';
import fetchUsers from '../actions/users/fetch_by_group'; // TODO: change to collective
import notify from '../actions/notification/notify';
import payExpense from '../actions/expenses/pay';
import rejectExpense from '../actions/expenses/reject';
import validateSchema from '../actions/form/validate_schema';

// Selectors
import {
  canEditCollectiveSelector,
  getI18nSelector,
  getPopulatedCollectiveSelector,
  isHostOfCollectiveSelector } from '../selectors/collectives';
import { getAppRenderedSelector } from '../selectors/app';
import { 
  getUsersSelector } from '../selectors/users';
import { 
  isSessionAuthenticatedSelector,
  getAuthenticatedUserSelector } from '../selectors/session';
import {
  getApproveInProgressSelector,
  getRejectInProgressSelector,
  getPayInProgressSelector } from '../selectors/expenses';


export class Expenses extends Component {

  render() {
    const { 
      collective, 
    } = this.props;
    
    return (
      <div>
        <LoginTopBar />
        <Notification />
        <div className='bg-gray pt2'>
          <h2 className='center'> Unpaid expenses for <Link to={`/${collective.slug}`}> {collective.name} </Link> </h2>
          
          <div className='flex flex-column justify-center bg-gray'>
            {collective.expenses
              .map(expense => 
                <CollectiveExpenseDetail 
                  key={expense.id}
                  collective={ collective }
                  expense={ expense }
                  onApprove={approveExp.bind(this)}
                  onReject={rejectExp.bind(this)}
                  onPay={payExp.bind(this)}
                  onUpdate={updateExp.bind(this)}
                  {...this.props}
                  />)}
          </div>
        </div>
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

/*
 * Approve expense
 */
export function approveExp(expenseId) {
  const {
    collective,
    approveExpense,
    fetchPendingExpenses
  } = this.props;

  return approveExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .catch(({message}) => notify('error', message));
}

/*
 * Reject expense
 */
export function rejectExp(expenseId) {
  const {
    collective,
    rejectExpense,
    fetchPendingExpenses
  } = this.props;

  return rejectExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .catch(({message}) => notify('error', message));
}

/*
 * Pay expense
 */
export function payExp(expenseId) {
  const {
    collective,
    payExpense,
    fetchPendingExpenses,
    fetchTransactions
  } = this.props;

  return payExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .then(() => fetchTransactions(collective.slug))
    .catch(({message}) => notify('error', message));
}

/*
 * Update expense
 */
export function updateExp(expenseId) {
  const {
    collective,
    approveExpense,
    fetchPendingExpenses
  } = this.props;

  return approveExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .catch(({message}) => notify('error', message));
}

const mapStateToProps = createStructuredSelector({
    // collective props
    collective: getPopulatedCollectiveSelector,

    canEditCollective: canEditCollectiveSelector,
    authenticatedUser: getAuthenticatedUserSelector,
    isAuthenticated: isSessionAuthenticatedSelector,
    isHost: isHostOfCollectiveSelector,

    approveInProgress: getApproveInProgressSelector,
    rejectInProgress: getRejectInProgressSelector,
    payInProgress: getPayInProgressSelector,

    i18n: getI18nSelector,
    loadData: getAppRenderedSelector,
    users: getUsersSelector
  });

export default connect(mapStateToProps, {
  approveExpense,
  fetchPendingExpenses,
  fetchTransactions,
  fetchProfile,
  fetchUsers,
  notify,
  payExpense,
  rejectExpense,
  validateSchema
})(Expenses);

Expenses.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
}