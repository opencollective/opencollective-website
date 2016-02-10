import React, { PropTypes } from 'react';
import classnames from 'classnames';

const TextArea = ({
  hasError,
  placeholder,
  maxLength,
  rows,
  handleChange,
  value,
  customClass
}) => {
  const className = classnames({
    TextArea: true,
    'TextArea--error': hasError,
    [customClass]: !!customClass
  });

  return (
    <span className={className}>
      <textarea
        className='Field'
        maxLength={maxLength}
        placeholder={placeholder || labelText}
        value={value}
        rows={rows}
        onChange={(e) => handleChange(e.target.value) } />
    </span>
  );
};

TextArea.propTypes = {
  handleChange: PropTypes.func.isRequired,
  max: PropTypes.string,
  hasError: PropTypes.bool,
  placeholder: PropTypes.string
};

TextArea.defaultProps = {
  hasError: false,
  value: ''
};

export default TextArea;
