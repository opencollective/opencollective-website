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
    const { 
      amount,
      createdAt,
      currency,
      interval,
      isActive,
      Order: donation  } = subscription;

    const formattedAmount = formatCurrency(amount, currency, {compact: true});
    const formattedInterval = `${interval[0].toUpperCase()}${interval.substr(1)}ly`;
    const formattedCreatedAt = isActive ? `${i18n.getString('since')} ${i18n.moment(createdAt).format('MMM, YYYY')}`: 'Cancelled';
    const { Transactions } = donation;
    const group = donation.collective;
    const name = group ? group.name : '';
    const logo = group ? group.image : '';
    return (
      <div className='SubscriptionItem'>
        <div className='SubscriptionItem-header'>
          <div className='left'>{ name }</div>
          <div className={`right ${isActive ? '' : 'canceled'}`} onClick={this.toggleActivation.bind(this)}>{`${isActive ? 'Cancel Subscription' : ''}`}</div>
        </div>
        <div className='SubscriptionItem-body'>
          <div className='SubscriptionItem-image' onClick={onClickImage} style={{display: logo ? 'inline-block': 'none', backgroundImage: `url(${logo})`}}></div>
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
              {Transactions.sort((A, B) => B.createdAt > A.createdAt).map((transaction, index) => {
                const description = transaction.title || transaction.description;
                const txDate = transaction.incurredAt || transaction.createdAt;
                return (
                  <li key={index}>
                    <div className='SubscriptionItem-DonationItem'>
                      <div className='flex'>
                        <div className='flex-auto'>
                          <div className='flex flex-column'>
                            <div className='flex'>
                              <div className='flex-auto'>
                                <div className='description'>{description}</div>
                              </div>
                              <div className='amount'>{formattedAmount}<small>{currency}</small></div>
                            </div>
                            <div className='flex'>
                              <div className='time-ago flex-auto'>{moment(txDate).fromNow()}</div>
                              <div className='pdf'><a href={`/${group.slug}/transactions/${transaction.uuid}/invoice.pdf`}>download invoice</a></div>
                            </div>
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
