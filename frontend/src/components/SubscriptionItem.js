import React, { Component } from 'react';

import formatCurrency from '../lib/format_currency';
import moment from 'moment';

export default class SubscriptionItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
  }

  render() {
    const { subscription, i18n, onClickImage } = this.props;
    const { opened } = this.state;
    const { amount } = subscription;
    const { createdAt } = subscription
    const { currency } = subscription;
    const { interval } = subscription;
    const { isActive } = subscription;
    const formattedAmount = formatCurrency(amount, currency, {compact: true});
    const formattedInterval = `${interval[0].toUpperCase()}${interval.substr(1)}ly`;
    const formattedCreatedAt = isActive ? `${i18n.getString('since')} ${moment(createdAt).format('MMM, YYYY')}`: 'Inactive';
    const { Transactions } = subscription;
    const Group = Transactions.length ? Transactions[0].Group : null;
    const name = Group ? Group.name : '';
    const image = Group ? Group.image : '';
    return (
      <div className='SubscriptionItem'>
        <div className='SubscriptionItem-header'>
          <div className='left'>{ name }</div>
          <div className={`right ${isActive ? '' : 'canceled'}`} onClick={this.toggleActivation.bind(this)}>{`${isActive ? 'Cancel Subscription' : 'Canceled'}`}</div>
        </div>
        <div className='SubscriptionItem-body'>
          <div className='SubscriptionItem-image' onClick={onClickImage} style={{display: image ? 'inline-block': 'none', backgroundImage: `url(${image})`}}></div>
          <div className='SubscriptionItem-info'>
            <div className='SubscriptionItem-info-amount'>
              <span>{formattedAmount}</span>
              <span className='currency-code'>{currency}</span>
            </div>
            <div className='SubscriptionItem-info-recurrence'>{`${formattedInterval} (${formattedCreatedAt})`}</div>
          </div>
        </div>
        <div className='SubscriptionItem-footer'>
          {opened && (
            <ul>
              {Transactions.map((transaction, index) => {
                const description = transaction.title || transaction.description;
                const { avatar } = transaction.User;
                const txDate = transaction.incurredAt || transaction.createdAt;
                return (
                  <li key={index}>
                    <div className='SubscriptionItem-DonationItem'>
                      <div className='flex'>
                        <div>
                          <img src={avatar} height='40px' width='40px'/>
                        </div>
                        <div className='flex-auto'>
                          <div className='flex flex-column'>
                            <div className='flex'>
                              <div className='flex-auto'>
                                <div className='description'>{description}</div>
                              </div>
                              <div className='amount'>{formattedAmount}<small>{currency}</small></div>
                            </div>
                            <div className='time-ago'>{moment(txDate).fromNow()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <div className='footer-button' onClick={this.toggleOpened.bind(this)}>{`${opened ? 'hide' : 'show'} transactions`}</div>
        </div>
      </div>
    )
  }

  toggleActivation() {
    const { subscription, onCancel, onSubscribe } = this.props;
    if (subscription.isActive) {
      if (onCancel) onCancel(subscription.id);
    } else {
      if (onSubscribe) onSubscribe(subscription.id);
    }
  }

  toggleOpened() {
    this.setState({opened: !this.state.opened});
  }
}
