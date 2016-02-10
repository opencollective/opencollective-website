import React, { PropTypes } from 'react';

import Icon from './Icon';
import AsyncButton from './AsyncButton';

const SaveButton = ({save, inProgress}) => {
  return (
    <div>
      <AsyncButton
        customClass='Button--save'
        inProgress={inProgress}
        onClick={save.bind(this)}>
        <Icon type='approved' /> Save
      </AsyncButton>
    </div>
  );
}

SaveButton.propTypes = {
  save: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired
};

export default SaveButton;
