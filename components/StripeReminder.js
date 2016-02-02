import React, { Component } from 'react';

import AsyncButton from './AsyncButton';

class StripeReminder extends Component {

  constructor(props) {
    super(props);
    this.state = { inProgress: false };
  }

  render() {
    const { isSuccessful } = this.props;

    return (
      <div className='Reminder'>
        {isSuccessful && (
          <div>
            Your Stripe account is now connected.
          </div>
        )}
        {!isSuccessful && (
          <div>
            Please connect your Stripe account to receive donations
          </div>
        )}
        {!isSuccessful && (
          <AsyncButton
            customClass='Button--stripe'
            inProgress={this.state.inProgress}
            onClick={this.handleClick.bind(this)}>
            Authenticate with Stripe
          </AsyncButton>
        )}
      </div>
    );
  }

  handleClick() {
    this.setState({inProgress: true});

    this.props.authorizeStripe();
  }
}

export default StripeReminder;
