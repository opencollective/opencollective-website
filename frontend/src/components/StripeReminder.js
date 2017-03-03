import React, { Component, PropTypes } from 'react';

import ConnectStripeButton from './ConnectStripeButton';

class StripeReminder extends Component {
  render() {
    const {
      onClickConnect,
      onClickInProgress,
      i18n
    } = this.props;

    return (
      <div className='StripeReminder'>
        { i18n.getString('stripeReminderNeedAccount') }
        <ConnectStripeButton
          disabled={ onClickInProgress }
          onClick={ onClickConnect }
          inProgress={ onClickInProgress }
          i18n={i18n}
        />
      </div>
    );
  }
}

StripeReminder.propTypes = {
  onClickConnect: PropTypes.bool.isRequired,
  onClickInProgress: PropTypes.bool,
  i18n: PropTypes.object.isRequired,
};

export default StripeReminder;
