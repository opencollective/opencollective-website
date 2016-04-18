import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Input = (
  {
    type,
    hasError,
    placeholder,
    maxLength,
    handleChange,
    value,
    customClass,
    prefix
  }) => {
    const className = classnames({
      Input: true,
      'Input--error': hasError,
      [customClass]: !!customClass
    });

    return (
      <div className={className} data-prefix={prefix}>
        <input
          className='Field'
          type={type}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value) } />
      </div>
    );
};

Input.propTypes = {
  handleChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  max: PropTypes.string,
  hasError: PropTypes.bool,
  placeholder: PropTypes.string
};

Input.defaultProps = {
  type: 'text',
  hasError: false,
  value: ''
};

export default Input;
