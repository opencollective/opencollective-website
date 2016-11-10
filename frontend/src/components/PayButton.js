import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';

// Leave non shallow until proper way of testing them
class PayButton extends Component {
  render() {
    const {
      payExp,
      inProgress,
      disabled,
      i18n
    } = this.props;


    return (
      <div>
        <AsyncButton
          customClass='Button--pay'
          inProgress={inProgress}
          disabled={disabled}
          onClick={payExp.bind(this)}>
          {i18n.getString('pay')}
        </AsyncButton>
      </div>
    );
  }
}

PayButton.propTypes = {
  payExp: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired
};

export default PayButton;
