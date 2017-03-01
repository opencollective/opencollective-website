import React, { Component, PropTypes } from 'react';

import ConnectPaypalButton from './ConnectPaypalButton';

class PaypalReminder extends Component {
  render() {
    const {
      card,
      onClickConnect,
      onClickInProgress,
      i18n
    } = this.props;

    return (
      <div className='PaypalReminder'>
        {!card &&
          <div>
            { i18n.getString('paypalReminderNeedValidAccount') }
            <ConnectPaypalButton
              disabled={ onClickInProgress }
              onClick={ onClickConnect }
              inProgress={ onClickInProgress }
              i18n={i18n}
            />
          </div>}
        {card && 
          <div>
          { `${i18n.getString('paypalReminderAccountLinked')} ${card.number}.`} 
          <span className='PaypalReminder-switch ml1' onClick={ onClickConnect }> {i18n.getString('paypalReminderSwitchAccount')} </span>
          </div>}

      </div>
    );
  }
}

PaypalReminder.propTypes = {
  card: PropTypes.object,
  onClickConnect: PropTypes.bool.isRequired,
  onClickInProgress: PropTypes.bool,
  i18n: PropTypes.object.isRequired,
};

export default PaypalReminder;
