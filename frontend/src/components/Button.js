import React from 'react';
import classNames from 'classnames';

import Icon from './Icon';

export default ({children, label, color, inProgress, onClick}) => {
  const className = classNames({
    'Button': true,
    'Button--submit': true,
    [`Button--${color}`]: !!color,
    'Button--inProgress': inProgress,
  });

  return (
    <span>
      <button
        onClick={onClick}
        className={className}>
        {label}
      </button>
    </span>
  );
}
