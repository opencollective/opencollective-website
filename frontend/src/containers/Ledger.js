import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// lib
import { scrollToExpense } from '../lib/utils';

// Containers
import LoginTopBar from './LoginTopBar';
import Notification from './Notification';
import SubmitExpense from './SubmitExpense';

// components
import Button from '../components/Button';
import CollectiveExpenseItem from '../components/collective/CollectiveExpenseItem';
import CollectiveTransactions from '../components/collective/CollectiveTransactions';
import Currency from '../components/Currency';
import ExpenseEmptyState from '../components/ExpenseEmptyState';
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
import { getAuthenticatedUserSelector } from '../selectors/session';
import { getPathnameSelector, getParamsSelector } from '../selectors/router';
import {
  getApproveInProgressSelector,
  getRejectInProgressSelector,
  getPayInProgressSelector } from '../selectors/expenses';


export class Ledger extends Component {

  constructor(props) {
    super(props);
    this.approveExp = approveExp.bind(this);
    this.rejectExp = rejectExp.bind(this);
    let showTransactions = true;
    let showUnpaidExpenses = true;
    const showSubmitExpense = Boolean(props.pathname.match(/new$/));

    if (props.pathname.match(/transactions$/)) {
      showUnpaidExpenses = false;
    } else if (props.pathname.match(/unpaidexpenses$/)) {
      showTransactions = false;
    }
    this.state = {
      showTransactions,
      showSubmitExpense,
      showUnpaidExpenses
    };
  }

  toggleAddExpense() {
    this.setState({ showSubmitExpense: !this.state.showSubmitExpense });
  }

  render() {
    const { 
      collective,
      users,
      authenticatedUser, 
      i18n, 
      canEditCollective, 
      isHost,
      approveInProgress,
      rejectInProgress,
      payInProgress } = this.props;

    const { showSubmitExpense, showUnpaidExpenses, showTransactions } = this.state;
    return (
      <div className='Ledger'>
        <LoginTopBar />
        <Notification />

        <div className='Ledger-container padding40' style={{marginBottom: '0'}}>
          <div className='line1'>collective information</div>
          <div className='info-block mr3'>
            <div className='info-block-value'><a href={`/${collective.slug}`}>{collective.name}</a></div>
            <div className='info-block-label'>collective</div>
          </div>
          <div className='info-block'>
            <div className='info-block-value'>
              <Currency value={collective.balance} currency={collective.currency} precision={2} />
            </div>
            <div className='info-block-label'>funds</div>
          </div>
        </div>

        {showSubmitExpense && <div className='Ledger-container' style={{marginTop: '0'}}>
          <SubmitExpense onCancel={this.toggleAddExpense.bind(this)} user={authenticatedUser} />
        </div>}

        {!showSubmitExpense && 
          <div className='Ledger-container padding40' style={{marginTop: '0'}}>
            <Button onClick={this.toggleAddExpense.bind(this)} label='Submit Expense' id='submitExpenseBtn' />
          </div>}

        {showUnpaidExpenses && <div className='Ledger-container padding40 expenses-container'>
            <div className='line1'>unpaid expenses</div>
            <div className='-list'>
            {collective.expenses
              .map(expense => 
                <CollectiveExpenseItem 
                  key={ expense.id }
                  user={ users[expense.UserId] }
                  expense={ expense }
                  compact={ false }
                  i18n={ i18n }
                  onApprove={ approveExp.bind(this) }
                  onReject={ rejectExp.bind(this) }
                  onPay={ payExp.bind(this) }
                  canApproveOrReject={ canEditCollective || isHost }
                  canPay={ isHost }
                  authenticatedUser={ authenticatedUser }
                  approveInProgress={ approveInProgress }
                  rejectInProgress={ rejectInProgress }
                  payInProgress={ payInProgress }
                  />)}
            </div>
            {collective.expenses.length === 0 && 
              <div className='center'>
                <ExpenseEmptyState i18n={i18n} />
              </div>}
        </div>}

        {showTransactions && <div className='Ledger-container padding40'>
            <div className='line1'>transactions</div>
            <div className='-list'>
              <CollectiveTransactions {...this.props} hasHost={ false } itemsToShow ={ 100 }/>
            </div>
        </div>}
        <PublicFooter />
      </div>
    );

  }

  loadCollectiveData() {
    const { collective, params, fetchProfile } = this.props;
    if (collective && collective.id) return Promise.resolve(collective);
    return fetchProfile(params.slug).then(result => {
      return result.groups[result.slug];
    });
  }

  componentWillMount() {
    const { 
      fetchUsers,
      fetchPendingExpenses,
      fetchTransactions,
      params
    } = this.props;

    this.loadCollectiveData()
      .then((collective) => {
        this.collective = collective;
        return Promise.all([
          fetchUsers(collective.slug),
          fetchPendingExpenses(collective.slug),
          fetchTransactions(collective.slug)
          ])
      })
      .then(() => {
        switch (params.action) {
          case 'approve':
            return this.approveExp(params.expenseid);
          case 'reject':
            return this.rejectExp(params.expenseid);
        }
      })

      .then(() => scrollToExpense());
  }
}

/*
 * Approve expense
 */
export function approveExp(expenseId) {
  const {
    approveExpense,
    fetchPendingExpenses,
    notify
  } = this.props;
  return approveExpense(this.collective.id, expenseId)
    .then(() => fetchPendingExpenses(this.collective.slug))
    .catch(({message}) => notify('error', message));
}

/*
 * Reject expense
 */
export function rejectExp(expenseId) {
  const {
    fetchPendingExpenses,
    rejectExpense,
    notify
  } = this.props;

  return rejectExpense(this.collective.id, expenseId)
    .then(() => fetchPendingExpenses(this.collective.slug))
    .catch(({message}) => notify('error', message));
}

/*
 * Pay expense
 */
export function payExp(expenseId) {
  const {
    fetchPendingExpenses,
    fetchTransactions,
    payExpense,
    notify
  } = this.props;

  return payExpense(this.collective.id, expenseId)
    .then(() => fetchPendingExpenses(this.collective.slug))
    .then(() => fetchTransactions(this.collective.slug))
    .catch(({message}) => notify('error', message));
}

const mapStateToProps = createStructuredSelector({
  // general data
  collective: getPopulatedCollectiveSelector,
  users: getUsersSelector,

  // expense action related
  approveInProgress: getApproveInProgressSelector,
  rejectInProgress: getRejectInProgressSelector,
  payInProgress: getPayInProgressSelector,

  // auth related
  authenticatedUser: getAuthenticatedUserSelector,
  canEditCollective: canEditCollectiveSelector,
  isHost: isHostOfCollectiveSelector,

  // other
  i18n: getI18nSelector,
  loadData: getAppRenderedSelector,
  pathname: getPathnameSelector,
  params: getParamsSelector
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
})(Ledger);

Ledger.propTypes = {
  collective: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
}