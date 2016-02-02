import React from 'react';
import Currency from './Currency';

export default ({group, label}) => {
  return (
    <div className='Well'>
      <span className='Well-primary'>
        {!!label ? label : 'Current balance'}
      </span>
      <span className='Well-right'>
        <Currency value={group.balance} currency={group.currency} />
      </span>
    </div>
  );
};
