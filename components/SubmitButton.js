import React from 'react';
import classNames from 'classnames';

import Icon from './Icon';

export default ({children, label, color, inProgress}) => {
  const className = classNames({
    'Button': true,
    'Button--submit': true,
    [`Button--${color}`]: !!color,
    'Button--inProgress': inProgress,
  });

  return (
    <span>
      <button

        type='submit'
        className={className}>
        {!!children ? children : (
          <span>
            <Icon type='upload' /> {label || 'Submit'}
          </span>
        )}
      </button>
    </span>
  );
}
