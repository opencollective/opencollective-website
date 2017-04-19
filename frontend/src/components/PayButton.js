import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';

// Leave non shallow until proper way of testing them
class PayButton extends Component {
  render() {
    const {
      onClick,
      inProgress,
      disabled,
      label,
      className,
      i18n
    } = this.props;


    return (
      <div>
        <AsyncButton
          customClass='Button--pay'
          inProgress={inProgress}
          disabled={disabled}
          className={className}
          onClick={onClick.bind(this)}>
          {label || i18n.getString('pay')}
        </AsyncButton>
      </div>
    );
  }
}

PayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default PayButton;
