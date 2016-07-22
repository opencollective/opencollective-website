import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import LoginTopBar from '../containers/LoginTopBar';
import ExpenseItem from '../components/ExpenseItem';
import TransactionItem from '../components/TransactionItem';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Currency from '../components/Currency';

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
    const { transactions, users, i18n, group, type } = this.props;
    const showSubmitExpense = this.state.showSubmitExpense;
    const hasExistingTransactions = Boolean(transactions.length);
    return (
     <div className='Transactions'>
        <LoginTopBar />
        <div className='Transactions-container padding40' style={{marginBottom: '0'}}>
          <div className='line1'>collective information</div>
          <div className='info-block mr3'>
            <div className='info-block-value'>{group.name}</div>
            <div className='info-block-label'>collective</div>
          </div>
          <div className='info-block'>
            <div className='info-block-value'>
              <Currency value={group.balance/100} currency={group.currency} precision={2} />
            </div>
            <div className='info-block-label'>funds</div>
          </div>
        </div>

        {type === 'expense' && showSubmitExpense && (
          <div className='Transactions-container' style={{marginTop: '0'}}>
            <SubmitExpense onCancel={this.toggleAddExpense.bind(this)} />
          </div>
        )}
        {(!showSubmitExpense && type === 'expense') && (
          <div className='Transactions-container padding40' style={{marginTop: '0'}}>
            <Button onClick={this.toggleAddExpense.bind(this)} label='Submit Expense' id='submitExpenseBtn' />
          </div>
        )}
        {hasExistingTransactions && 
          <div className='Transactions-container padding40 expenses-container'>
            <div className='line1'>latest {`${type}s`}</div>
            <div className='-list'>
              {transactions.map(tx => {
                if (type === 'expense') {
                  return <ExpenseItem key={tx.id} expense={tx} i18n={i18n} user={users[tx.UserId]} precision={2} />;
                } else {
                  return <TransactionItem key={tx.id} transaction={tx} i18n={i18n} user={users[tx.UserId]} precision={2} />;
                }
              })}
            </div>
          </div>
        }
        {!hasExistingTransactions && (
          <div className='Transactions-container padding40 expenses-container -empty-state' style={{height: '140px'}}>
            <Icon type='expense' />
            <div className='line1 inline'>
              {i18n.getString(`${type}List-showUpHere`)}
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
