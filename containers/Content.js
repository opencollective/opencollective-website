import React from 'react';
import classnames from 'classnames';

export default ({isLoading, hasPopOverMenuOpen, children}) => {
  const className = classnames({
    'Content': true,
    'Content--isLoading': isLoading,
    'Content--hasPopOverMenuOpen': hasPopOverMenuOpen
  });

  return (
    <div className={className}>
      {
        isLoading ?
        <div className='Content-loadingIcon'></div> :
        null
      }
      {children}
    </div>
  );
}

