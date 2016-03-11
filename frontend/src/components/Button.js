import React from 'react';
import classNames from 'classnames';

export default ({id, label, color, inProgress, onClick}) => {
  const className = classNames({
    'Button': true,
    'Button--submit': true,
    [`Button--${color}`]: !!color,
    'Button--inProgress': inProgress,
  });

  return (
    <span>
      <button
        id={id}
        onClick={onClick}
        className={className}>
        {label}
      </button>
    </span>
  );
}
