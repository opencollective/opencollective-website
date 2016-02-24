import React, { Component } from 'react';

import { connect } from 'react-redux';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';

import filterCollection from '../lib/filter_collection';

import Currency from '../components/Currency';
import DisplayUrl from '../components/DisplayUrl';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import PublicTopBar from '../components/PublicTopBar';
import TransactionItem from '../components/TransactionItem';

import fetchUsers from '../actions/users/fetch_by_group';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import logout from '../actions/session/logout';
import decodeJWT from '../actions/session/decode_jwt';

export class Transactions extends Component {
  render() {
    const {
      group,
      transactions,
      users
    } = this.props;

    return (
     <div className='Transactions'>

        <PublicTopBar session={this.props.session} logout={this.props.logout}/>

        <div className='PublicContent'>
          <div className='Widget-header'>

            <div className='PublicGroupHeader'>
              <img className='PublicGroupHeader-logo' src={group.logo ? group.logo : '/static/images/media-placeholder.svg'} />
              <div className='PublicGroupHeader-website'><DisplayUrl url={group.website} /></div>
              <div className='PublicGroupHeader-description'>
                {group.description}
              </div>
            </div>

            <div className='Widget-balance'>
              <Currency
                value={group.balance}
                currency={group.currency} />
            </div>
            <div className='Widget-label'>Available funds</div>
          </div>

          <div className='PublicGroup-transactions'>
            <h2>Latest transactions</h2>
            {(transactions.length === 0) && (
              <div className='PublicGroup-emptyState'>
                <div className='PublicGroup-expenseIcon'>
                  <Icon type='expense' />
                </div>
                <label>
                  All transactions will show up here
                </label>
              </div>
            )}
            {transactions.map(tx => <TransactionItem
                                       key={tx.id}
                                       transaction={tx}
                                       user={users[tx.UserId]} />)}
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {
    const {
      group,
      fetchTransactions,
      fetchUsers
    } = this.props;

    fetchTransactions(group.id, {
      sort: 'createdAt',
      direction: 'desc'
    });

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
  logout,
  decodeJWT
})(Transactions);

function mapStateToProps({
  session,
  groups,
  transactions,
  users
}) {
  const group = values(groups)[0] || {}; // to refactor to allow only one group

  return {
    session,
    group,
    transactions: sortBy(transactions, txn => txn.createdAt).reverse(),
    users
  };
}
