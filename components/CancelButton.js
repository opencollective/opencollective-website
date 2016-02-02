import React, { PropTypes } from 'react';
import AsyncButton from './AsyncButton';
import Icon from './Icon';

const CancelButton = ({cancel, inProgress}) => {
  return (
    <div>
      <AsyncButton
        customClass='Button--cancel'
        inProgress={inProgress}
        onClick={cancel.bind(this)}>
        <Icon type='rejected' /> Cancel
      </AsyncButton>
    </div>
  );
}

CancelButton.propTypes = {
  cancel: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default CancelButton;
