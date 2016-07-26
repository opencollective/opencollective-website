import React, { Component, PropTypes } from 'react';

export default class SubscriptionItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='SubscriptionItem'>
        <div className='SubscriptionItem-header'>
          <div className='left'>WWCode Seattle</div>
          <div className='right'>Cancel Subscription</div>
        </div>
        <div className='SubscriptionItem-body'>
          <div className='SubscriptionItem-image'></div>
          <div className='SubscriptionItem-info'>
          <div className='SubscriptionItem-info-amount'>
            <span>$1.00</span>
            <span className='currency-code'>usd</span>
          </div>
          <div className='SubscriptionItem-info-recurrence'>Monthly (Inactive)</div>
          </div>
        </div>
        <div className='SubscriptionItem-footer'>
          <div className='footer-button'>show transactions</div>
        </div>
      </div>
    )
  } 
}
