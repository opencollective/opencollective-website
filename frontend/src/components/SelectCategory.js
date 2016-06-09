import React from 'react';
import Select from './Select';

export default ({categories, attributes, handleChange, disabled}) => {
  const props = {
    value: attributes.category ? attributes.category : categories[0],
    options: categories,
    handleChange,
    disabled
  };

  return <Select {...props} />;
};
