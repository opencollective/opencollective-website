import React, { Component } from 'react';

import { connect } from 'react-redux';

import PublicTopBar from '../components/PublicTopBar';
import PublicFooter from '../components/PublicFooter';
import Currency from '../components/Currency';
import TransactionItem from '../components/TransactionItem';
import Notification from '../components/Notification';

import decodeJWT from '../actions/session/decode_jwt';
import logout from '../actions/session/logout';
import sendSubscriptionsToken from '../actions/users/send_subscriptions_token';
import cancelSubscription from '../actions/subscriptions/cancel';
import resetNotifications from '../actions/notification/reset';
import notify from '../actions/notification/notify';

// To put as standalone component when the design is final
const SubscriptionTokenForm = ({sendToken}) => {
  return (
    <div>
      <h2>Your link has expired</h2>
        <p>Click here to get an email with the new link</p>
        <div
          className='Button Button--green'
          onClick={() => sendToken()}>
          Send
        </div>
      </div>
  );
};

export class Subscriptions extends Component {
  render() {
    const {
      subscriptions,
      session
    } = this.props

    return (
      <div className='PublicGroup'>

        <PublicTopBar {...this.props} />
        <Notification {...this.props} />
        <div className='PublicContent'>

          {session.jwtExpired && <SubscriptionTokenForm sendToken={sendToken.bind(this)}/>}
          {subscriptions.map(subscription => {
            return (
              <div key={subscription.id}>
                <h3>
                  {subscription.isActive ? '[Active]' : '[Inactive]'} Subscription #{subscription.id} (
                    <Currency value={subscription.amount} currency={subscription.currency} colorify={false} />
                    /{subscription.interval}
                  )
                </h3>
                {subscription.isActive && <span className='Button Button--red' onClick={cancel.bind(this, subscription.id)}>Cancel</span>}
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

function cancel(id) {
  const {
    token,
    cancelSubscription,
    notify
  } = this.props;

  cancelSubscription(id, token)
    .then(() => notify('success', 'Canceled'))
    .catch(({message}) => notify('error', message));
}

function sendToken() {
  const {
    token,
    sendSubscriptionsToken,
    notify
  } = this.props;

  sendSubscriptionsToken(token)
    .then(() => notify('success', 'Email sent'))
    .catch(({message}) => notify('error', message));

}

export default connect(mapStateToProps, {
  logout,
  decodeJWT,
  sendSubscriptionsToken,
  resetNotifications,
  notify,
  cancelSubscription
})(Subscriptions);

function mapStateToProps({
  session,
  router,
  subscriptions,
  notification
}) {
  return {
    notification,
    session,
    subscriptions: subscriptions.list,
    token: router.params.token,
  };
}
