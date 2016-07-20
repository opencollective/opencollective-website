import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import LoginTopBar from '../containers/LoginTopBar';
import Input from '../components/Input';
import SelectCategory from '../components/SelectCategory';
import ImageUpload from '../components/ImageUpload';
import ExpenseItem from '../components/ExpenseItem';

import Currency from '../components/Currency';
import DisplayUrl from '../components/DisplayUrl';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import PublicTopBar from '../containers/PublicTopBar';
import SubmitExpense from '../containers/SubmitExpense';
import i18n from '../lib/i18n';

import TransactionItem from '../components/TransactionItem';

import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import decodeJWT from '../actions/session/decode_jwt';
import Button from '../components/Button';

export class Transactions extends Component {

  constructor(props) {
    super(props);
    this.state = {showSubmitExpense: props.router.location.pathname.match(/new$/) };
  };

  toggleAddExpense() {
    this.setState({ showSubmitExpense: !this.state.showSubmitExpense });
  };

  render() {
    const { group, transactions, users, type, i18n } = this.props;
    const showSubmitExpense = this.state.showSubmitExpense;
    const hasExistingTransactions = Boolean(transactions.length);
    console.log('>>>>>>>>>>>....')
    console.log(users)
    console.log(transactions)
    return (
     <div className='Transactions'>
        <LoginTopBar />
        {showSubmitExpense && (
          <div className='Transactions-container'>
            <SubmitExpense onCancel={this.toggleAddExpense.bind(this)} />
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
  const type = (router.params.type) ? router.params.type.slice(0,-1) : "expense"; // remove trailing s for the API call
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
