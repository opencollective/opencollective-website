import React, { PropTypes } from 'react';

const Icon = ({type}) => {
  return (
    <i className={`Icon Icon--${type}`} />
  );
};

Icon.PropTypes = {
  type: PropTypes.string.isRequired
};

export default Icon;
