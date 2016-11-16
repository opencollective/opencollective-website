import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';

// Leave non shallow until proper way of testing them
class ApproveButton extends Component {
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
          customClass='Button--approve'
          inProgress={inProgress}
          disabled={disabled}
          onClick={onClick.bind(this)}>
          {i18n.getString('approve')}
        </AsyncButton>
      </div>
    );
  }
}

ApproveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};

export default ApproveButton;
