import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import LoginTopBar from '../containers/LoginTopBar';
import ExpenseItem from '../components/ExpenseItem';
import Button from '../components/Button';
import Icon from '../components/Icon';

import PublicFooter from '../components/PublicFooter';
import SubmitExpense from '../containers/SubmitExpense';
import i18n from '../lib/i18n';

import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import decodeJWT from '../actions/session/decode_jwt';

export class Transactions extends Component {

  constructor(props) {
    super(props);
    this.state = {showSubmitExpense: Boolean(props.router.location.pathname.match(/new$/)) };
  };

  toggleAddExpense() {
    this.setState({ showSubmitExpense: !this.state.showSubmitExpense });
  };

  render() {
    const { transactions, users, i18n } = this.props;
    const showSubmitExpense = this.state.showSubmitExpense;
    const hasExistingTransactions = Boolean(transactions.length);
    return (
     <div className='Transactions'>
        <LoginTopBar />
        {showSubmitExpense && (
          <div className='Transactions-container'>
            <SubmitExpense onCancel={this.toggleAddExpense.bind(this)} />
          </div>
        )}
        {!showSubmitExpense && (
          <div className='Transactions-container padding40'>
            <Button onClick={this.toggleAddExpense.bind(this)} label='Submit Expense' id='submitExpenseBtn' />
          </div>
        )}
        {hasExistingTransactions && 
          <div className='Transactions-container padding40'>
            <div className='line1'>latest expenses</div>
            <div className='expenses-container'>
              {transactions.filter(tx => tx.type === 'EXPENSE').map(ex => <ExpenseItem key={ex.id} expense={ex} i18n={i18n} user={users[ex.UserId]} precision={2} />)}
            </div>
          </div>
        }
        {!hasExistingTransactions && (
          <div className='Transactions-container padding40 -empty-state' style={{height: '140px'}}>
            <Icon type='expense' />
            <div className='line1 inline'>
              {i18n.getString(`expenseList-showUpHere`)}
            </div>
          </div>
        )}

        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers,
      type
    } = this.props;

    const options = {
      sort: 'createdAt',
      direction: 'desc',
      [type]: true
    };

    fetchTransactions(group.id, options);

    fetchUsers(group.id);
  }

  componentDidMount() {
    // decode here because we don't handle auth on the server side yet
    this.props.decodeJWT();
  }
}

export default connect(mapStateToProps, {
  fetchTransactions,
  fetchUsers,
  decodeJWT
})(Transactions);

function mapStateToProps({
  session,
  groups,
  transactions,
  users,
  router
}) {
  const type = (router.params.type) ? router.params.type.slice(0,-1) : 'expense'; // remove trailing s for the API call
  const group = values(groups)[0] || {}; // to refactor to allow only one group
  const list = (type === 'donation') ? transactions.isDonation : transactions.isExpense;

  group.settings = group.settings || { lang: 'en' };

  return {
    session,
    group,
    transactions: sortBy(list, txn => txn.incurredAt || txn.createdAt).reverse(),
    router,
    users,
    i18n: i18n(group.settings.lang),
    type
  };
}
