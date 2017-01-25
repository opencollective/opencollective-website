import React, { Component, PropTypes } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

// lib
import { scrollToExpense, capitalize } from '../lib/utils';

// Containers
import LoginTopBar from './LoginTopBar';
import Notification from './Notification';
import SubmitExpense from './SubmitExpense';

// components
import RequestMoney from '../components/RequestMoney';
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
    this.switchView = this.switchView.bind(this);

    let view;
    switch (props.params.action) {
      case 'new':
        view = 'SubmitExpense';
        break;
      case 'request':
        view = 'RequestMoney';
        break;
    }

    this.state = {
      view
    };
  }

  switchView(view) {
    if (this.state.view === view)
      view = '';

    this.setState({view});
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
      params,
      payInProgress } = this.props;

    const { view } = this.state;
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

        { !params.action &&
        <div className='Ledger-container padding40' style={{marginTop: '0'}}>
          <div className='showButtons'>
            { params.type !== 'donations' &&
              <div className='col-12 sm-col-12 md-col-5 lg-col-5 pr1'>
                <Button className={(view === 'SubmitExpense') && 'selected'} onClick={() => this.switchView('SubmitExpense')} label={i18n.getString('submitExpense')} id='submitExpenseBtn' />
              </div>}
            { params.type !== 'expenses' &&
              <div className='col-12 sm-col-12 md-col-5 lg-col-5 pl1'>
                <Button className={(view === 'RequestMoney') ? 'selected' : ''} onClick={() => this.switchView('RequestMoney')} label={i18n.getString('requestMoney')} id='requestMoneyBtn' />
              </div>}
          </div>
        </div>
        }

        { view === 'SubmitExpense' && <div className='Ledger-container' style={{marginTop: '0'}}>
          <SubmitExpense onCancel={() => this.switchView()} user={authenticatedUser} />
        </div>}

        { view === 'RequestMoney' && <div className='Ledger-container' style={{marginTop: '0'}}>
          <RequestMoney
            onCancel={() => this.switchView()}
            collective={collective}
            i18n={i18n}
            />
        </div>}

        { params.type === 'expenses' && <div className='Ledger-container padding40 expenses-container'>
            <div className='line1'>unpaid expenses</div>
            <div className='-list'>
            {collective.unpaidExpenses
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
            {collective.unpaidExpenses.length === 0 && 
              <div className='center'>
                <ExpenseEmptyState i18n={i18n} />
              </div>}
        </div>}

         <div className='Ledger-container padding40'>
            <div className='line1'>{i18n.getString(`previous${capitalize(params.type)}`)}</div>
            <div className='-list'>
              <CollectiveTransactions {...this.props} transactions={ params.type === 'expenses' ? collective.paidExpenses : collective.transactions } hasHost={ false } itemsToShow ={ 100 }/>
            </div>
        </div>
        <PublicFooter />
      </div>
    );

  }

  componentWillMount() {
    const { 
      collective,
      fetchProfile,
      fetchUsers,
      fetchPendingExpenses,
      fetchTransactions,
      loadData,
      params
    } = this.props;

    let promise = Promise.resolve();

    if (loadData || !collective.id) { 
      promise = promise.then(() => fetchProfile(collective.slug));
    }

    switch (params.action) {
      case 'approve':
        promise = promise.then(() => this.approveExp(params.expenseid));
        break;
      case 'reject':
        promise = promise.then(() => this.rejectExp(params.expenseid));
        break;
    }

    promise = promise.then(() => Promise.all([
      fetchUsers(collective.slug),
      fetchPendingExpenses(collective.slug),
      fetchTransactions(collective.slug, { type: params.type })
      ]))
      .then(() => scrollToExpense());

    return promise;
  }
}

function findExpense(expenseId, expensesObj) {
  if (expensesObj) {
    for(let key in expensesObj) {
      if(expensesObj[key].id === expenseId) {
        return expensesObj[key];
      }
    }
  }
  return null;
}

/*
 * Approve expense
 */
export function approveExp(expenseId) {
  const {
    approveExpense,
    collective,
    fetchPendingExpenses,
    notify
  } = this.props;

  const expense = collective && collective.unpaidExpenses && collective.unpaidExpenses
  return approveExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .then(() => {
      const expense = findExpense(expenseId, collective.unpaidExpenses);
      if (expense) {
        return notify('success', `Expense approved: ${expense.amount/100} for ${expense.title}`)
      } else {
        return notify('success', 'Expense approved');
      }
    })
    .catch(({message}) => notify('error', message));
}

/*
 * Reject expense
 */
export function rejectExp(expenseId) {
  const {
    collective,
    fetchPendingExpenses,
    rejectExpense,
    notify
  } = this.props;

  return rejectExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .then(() => {
      const expense = findExpense(expenseId, collective.unpaidExpenses);
      if (expense) {
        return notify('success', `Expense rejected: ${expense.amount/100} for ${expense.title}`)
      } else {
        return notify('success', 'Expense rejected');
      }
    })
    .catch(({message}) => notify('error', message));
}

/*
 * Pay expense
 */
export function payExp(expenseId) {
  const {
    collective,
    fetchPendingExpenses,
    fetchTransactions,
    payExpense,
    notify,
    params
  } = this.props;

  return payExpense(collective.id, expenseId)
    .then(() => fetchPendingExpenses(collective.slug))
    .then(() => fetchTransactions(collective.slug, { type: params.type }))
    .then(() => {
      // we need to check both lists because of timing issues;
      const expense = findExpense(expenseId, collective.unpaidExpenses);
      const transaction = findExpense(expenseId, collective.paidExpenses); // in case it's already paid; timing issue.
      if (expense) {
        return notify('success', `Expense paid: ${expense.amount/100} for ${expense.title}`)
      } else if (transaction) {
        return notify('success', `Expense paid: ${transaction.amount} for ${transaction.description}`)
      } else {
        return notify('success', 'Expense paid');
      }
    })
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