import React, { Component, PropTypes } from 'react';

import ConnectPaypalButton from './ConnectPaypalButton';

class PaypalReminder extends Component {
  render() {
    const {
      paypalCard,
      onClickConnect,
      connectPaypalInProgress,
      i18n
    } = this.props;


    return (
      <div className='PaypalReminder'>
        {!paypalCard &&
          <div>
            { i18n.getString('paypalReminderNeedValidAccount') }
            <ConnectPaypalButton
              disabled={ connectPaypalInProgress }
              onClick={ onClickConnect }
              inProgress={ connectPaypalInProgress }
              i18n={i18n}
            />
          </div>}
        {paypalCard && 
          <div>
          { `${i18n.getString('paypalReminderCurrentlyLinkedPaypalAccount')} ${paypalCard.number}.`} 
          <span onClick={ onClickConnect }> {i18n.getString('paypalReminderSwitchAccount')} </span>
          </div>}

      </div>
    );
  }
}

PaypalReminder.propTypes = {
  onClick: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};

export default PaypalReminder;
