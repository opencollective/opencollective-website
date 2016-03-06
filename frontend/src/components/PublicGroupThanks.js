import React from 'react';

export default ({message}) => {
  return (
    <div className='PublicGroupThanks'>
      <div className='PublicGroupThanks-icon'></div>
      <div className='PublicGroupThanks-message'>
        {message || "Thank you for your support"}
      </div>
    </div>
  );
};
