import React, { Component, PropTypes } from 'react';

export default class SubscriptionItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      opened: true
    };
  }

  render() {
    const { opened } = this.state;
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
          {!opened && <div className='footer-button'>show transactions</div>}
          <ul>
            <li>
              <div className='SubscriptionItem-DonationItem'>
                <div className='flex'>
                  <div>
                    <img src='//d1ts43dypk8bqh.cloudfront.net/v1/avatars/1b16216d-38b1-45d6-b1d1-b89d0330fd68' height='40px' width='40px'/>
                  </div>
                  <div className='flex-auto'>
                    <div className='flex flex-column'>
                      <div className='flex'>
                        <div className='flex-auto'>
                          <div className='type'>Recurring Subscription</div>
                        </div>
                        <div className='amount'>$1.00<small>USD</small></div>
                      </div>
                      <div className='timeago'>1 month ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  } 
}
