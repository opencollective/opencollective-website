import React, { Component } from 'react';

import { connect } from 'react-redux';

import values from 'lodash/object/values';

import PublicTopBar from '../components/PublicTopBar';
import PublicFooter from '../components/PublicFooter';
import TransactionItem from '../components/TransactionItem';

import decodeJWT from '../actions/session/decode_jwt';
import logout from '../actions/session/logout';

export class Subscriptions extends Component {
  render() {
    const {
      transactions
    } = this.props
    return (
      <div className='PublicGroup'>

        <PublicTopBar session={this.props.session} logout={this.props.logout}/>

        <div className='PublicContent'>
          {transactions.map(transaction => <TransactionItem
                                          key={transaction.id}
                                          transaction={transaction}/>)}
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.props.decodeJWT();
  }
}

export default connect(mapStateToProps, {
  logout,
  decodeJWT
})(Subscriptions);

function mapStateToProps({
  session,
  transactions
}) {
  return {
    session,
    transactions: values(transactions)
  };
}
