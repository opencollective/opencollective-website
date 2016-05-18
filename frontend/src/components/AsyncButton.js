import React from 'react';
import classNames from 'classnames';

export default ({
  inProgress,
  onClick,
  customClass,
  children,
  color,
  disabled,
  style
}) => {
  const noop = () => {};
  const btnClass = classNames({
    'Button': true,
    [customClass]: !!customClass,
    [`Button--${color}`]: !!color,
    'Button--inProgress': inProgress,
    'Button--disabled': disabled
  });

  return (
    <div
      style={style}
      className={btnClass}
      onClick={disabled || inProgress ? noop : onClick} >
      {inProgress ? 'Loading' : children}
    </div>
  );
};
