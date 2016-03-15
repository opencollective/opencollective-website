import React from 'react';
import Select from './Select';

export default ({tags, attributes, handleChange, disabled}) => {
  const props = {
    value: attributes.tags ? attributes.tags[0] : tags[0],
    options: tags,
    handleChange,
    disabled
  };

  return <Select {...props} />;
};
