import React, { Component, PropTypes } from 'react';
import AsyncButton from './AsyncButton';

// Leave non shallow until proper way of testing them
class RejectButton extends Component {
  render() {
    const {rejectExp, inProgress, disabled, i18n} = this.props;

    return (
      <div>
        <AsyncButton
          customClass='Button--reject'
          inProgress={inProgress}
          disabled={disabled}
          onClick={rejectExp.bind(this)}>
          {i18n.getString('reject')}
        </AsyncButton>
      </div>
    );
  }
}

RejectButton.propTypes = {
  rejectExp: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  disable: PropTypes.bool.isRequired,
  i18n: PropTypes.object.isRequired
};

export default RejectButton;
