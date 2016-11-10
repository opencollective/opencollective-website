import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';

// Leave non shallow until proper way of testing them
class ApproveButton extends Component {
  render() {
    const {
      approveExp,
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
          onClick={approveExp.bind(this)}>
          {i18n.getString('approve')}
        </AsyncButton>
      </div>
    );
  }
}

ApproveButton.propTypes = {
  approveExp: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired
};

export default ApproveButton;
