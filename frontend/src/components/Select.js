import React, { PropTypes } from 'react';
import classnames from 'classnames';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';

const Select = ({options=[], value, handleChange, customClass, disabled}) => {
  const className = classnames({
    Select: true,
    [customClass]: !!customClass
  });

  return (
    <div className='SelectContainer'>
      <select
        disabled={disabled}
        className={className}
        value={value}
        onChange={(event) => handleChange(event.target.value)} >
        {options.map(opt => {
          if (isString(opt)) {
            return <option value={opt} key={opt}>{opt}</option>
          } else if (isObject(opt)) {
            return <option value={opt.value} key={opt.value}>{opt.label}</option>
          }
        })}
      </select>
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default Select;
