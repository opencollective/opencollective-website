import React, { PropTypes } from 'react';

import Icon from './Icon';
import AsyncButton from './AsyncButton';

const SaveButton = ({save, label, inProgress}) => {
  label = label || "Save";
  return (
    <AsyncButton
      customClass='Button--save'
      inProgress={inProgress}
      onClick={save.bind(this)}>
      <Icon type='approved' /> {label}
    </AsyncButton>
  );
}

SaveButton.propTypes = {
  save: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default SaveButton;
