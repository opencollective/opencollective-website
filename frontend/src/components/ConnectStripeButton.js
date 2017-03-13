import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';

// Leave non shallow until proper way of testing them
class ConnectStripeButton extends Component {
  render() {
    const {
      onClick,
      inProgress,
      disabled,
      i18n
    } = this.props;


    return (
      <div>
        <AsyncButton
          customClass='Button--connectstripe'
          inProgress={inProgress}
          disabled={disabled}
          onClick={onClick.bind(this)}>
          {i18n.getString('connectStripe')}
        </AsyncButton>
      </div>
    );
  }
}

ConnectStripeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};

export default ConnectStripeButton;
