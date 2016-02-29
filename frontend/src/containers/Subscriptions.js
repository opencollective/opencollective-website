import React, { Component } from 'react';

import { connect } from 'react-redux';

import PublicTopBar from '../components/PublicTopBar';
import PublicFooter from '../components/PublicFooter';
import Currency from '../components/Currency';
import TransactionItem from '../components/TransactionItem';

import decodeJWT from '../actions/session/decode_jwt';
import logout from '../actions/session/logout';

export class Subscriptions extends Component {
  render() {
    const {
      subscriptions
    } = this.props
    return (
      <div className='PublicGroup'>

        <PublicTopBar session={this.props.session} logout={this.props.logout}/>

        <div className='PublicContent'>

          {subscriptions.map(subscription => {
            return (
              <div key={subscription.id}>
                <h3>
                  Subscription #{subscription.id} (
                    <Currency value={subscription.amount} currency={subscription.currency} colorify={false} />
                    /{subscription.interval}
                  )
                </h3>
                {subscription.Transactions.map(transaction => {
                  return <TransactionItem key={transaction.id} transaction={transaction}/>;
                })}
              </div>
            );
          })}
        </div>
        <PublicFooter />
      </div>
    );
  }

}

export default connect(mapStateToProps, {
  logout,
  decodeJWT
})(Subscriptions);

function mapStateToProps({
  session,
  router,
  subscriptions
}) {
  return {
    session,
    subscriptions: subscriptions.list,
    token: router.params.token
  };
}
