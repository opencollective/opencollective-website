import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import PublicTopBar from '../containers/PublicTopBar';
import PublicFooter from '../components/PublicFooter';
import Currency from '../components/Currency';
import TransactionItem from '../components/TransactionItem';
import Notification from '../containers/Notification';
import SubscriptionEmailForm from '../components/SubscriptionEmailForm';
import InlineToggle from '../components/InlineToggle';
import ProfilePhoto from '../components/ProfilePhoto';

import validate from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';
import cancelSubscription from '../actions/subscriptions/cancel';
import refreshSubscriptionsToken from '../actions/users/refresh_subscriptions_token';
import sendNewSubscriptionsToken from '../actions/users/send_new_subscriptions_token';
import notify from '../actions/notification/notify';
import getSubscriptions from '../actions/subscriptions/get';
import storeToken from '../actions/session/store_token';

// To put as standalone component when the design is final
const SubscriptionNewTokenForm = ({sendToken}) => {
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
      session,
      jwtTokenValid,
      i18n,
      pushState
    } = this.props;

    return (
      <div className='Subscription'>

        <PublicTopBar />
        <Notification />
        <div className='PublicContent'>
          <div className='Subscription-header'>
            <div className='Subscription-page-title'>
              <h3> Your Subscriptions </h3>
            </div>
            {jwtTokenValid && subscriptions.length > 0 &&
              <div className='Subscription-user'>
                 <ProfilePhoto
                    hasBorder={true}
                    url={subscriptions[0].Transactions[0].User && subscriptions[0].Transactions[0].User.avatar} />
                {subscriptions[0].Transactions[0].User.name ?
                  <span className='Subscription-user-name' title={subscriptions[0].Transactions[0].User.email}> {subscriptions[0].Transactions[0].User.name}</span> :
                  <span className='Subscription-user-name'> {subscriptions[0].Transactions[0].User.email}</span>
                }
              </div>
            }
          </div>
          {session.jwtExpired && <SubscriptionNewTokenForm sendToken={refreshToken.bind(this)}/>}
          {session.jwtInvalid && <SubscriptionEmailForm onClick={sendNewToken.bind(this)} {...this.props}/>}
          {subscriptions.map(subscription => {
              const divStyle = {
                backgroundImage: `url(${subscription.Transactions[0].Group.logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              };
            return (
                <div className='Subscription-group' key={subscription.id} >
                  <div className='Subscription-logo' style={divStyle} onClick={() => pushState(null, `/${subscription.Transactions[0].Group.slug}`)} >
                  </div>
                  <div className='Subscription-info'>
                    <div className='Subscription-name'>
                        {subscription.Transactions[0].Group.name}
                    </div>
                    <div className='Subscription-amount'>
                        <Currency value={subscription.amount} currency={subscription.currency} colorify={false}/> {subscription.interval}ly
                        {subscription.isActive &&
                        subscription.createdAt ?
                          <span className='Subscription-status'>
                            &nbsp;({i18n.getString('since')} {moment(subscription.createdAt).format('MMM YYYY')})
                            {subscription.isActive &&
                              <span className='Subscription-cancel' onClick={cancel.bind(this, subscription.id)}>CANCEL</span>}
                          </span> :
                        <span className='Subscription-status'> (Inactive) </span>
                      }
                    </div>
                  </div>
                    <div className='Subscription-transactions'>
                      <InlineToggle showString='Show transactions' hideString='Hide transactions'>
                        {subscription.Transactions.map(transaction => {
                          return <TransactionItem key={transaction.id} transaction={transaction}/>;
                        })}
                      </InlineToggle>
                    </div>

                </div>
              );
          })}
          {jwtTokenValid && subscriptions.length > 0 &&
            <div className='Subscription-text Subscription-bottom-text'>
              <p> Visit our <a href='https://www.opencollective.com/leaderboard'>leaderboard</a> to find more collectives to support! </p>
            </div>
          }
          {jwtTokenValid && subscriptions.length === 0 &&
            <div className='Subscription-text'>
            <p> Looks like you aren't contributing right now. Let's fix it!</p>
            <p> Visit our <a href='https://www.opencollective.com/leaderboard'>leaderboard</a> to find more collectives to support. </p>
            </div>
          }
        </div>
        <PublicFooter />
      </div>
    );
  }

  componentDidMount(){
    this.props.storeToken(this.props.token);
  }

}

export function cancel(id) {
  const {
    token,
    cancelSubscription,
    notify,
    getSubscriptions
  } = this.props;

  if (window.confirm("Are you sure you want to cancel?")) {
    return cancelSubscription(id, token)
      .then(() => notify('success', 'Canceled'))
      .then(() => getSubscriptions(token))
      .catch(({message}) => notify('error', message));
    }
}


export function refreshToken() {
  const {
    token,
    refreshSubscriptionsToken,
    notify
  } = this.props;

  return refreshSubscriptionsToken(token)
  .then(() => notify('success', 'Email sent'))
  .catch(({message}) => notify('error', message));
}

export function sendNewToken(email) {
  const {
    sendNewSubscriptionsToken,
    notify
  } = this.props;

  return sendNewSubscriptionsToken(email)
  .then(() => notify('success', 'Email sent'))
  .catch(({message}) => notify('error', message));
}

export default connect(mapStateToProps, {
  decodeJWT,
  refreshSubscriptionsToken,
  sendNewSubscriptionsToken,
  notify,
  cancelSubscription,
  validate,
  getSubscriptions,
  storeToken,
  pushState
})(Subscriptions);

export function mapStateToProps({
  session,
  router,
  subscriptions,
  users
}) {
  return {
    session,
    subscriptions: subscriptions.list,
    token: router.params.token,
    inProgress: users.sendingEmailInProgress,
    jwtTokenValid: !session.jwtInvalid && !session.jwtExpired
  };
}
