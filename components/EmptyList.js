import React from 'react';

export default () => {
  return (
    <div className='EmptyList'>
      <div className='EmptyList-icon'>
        <img src='/static/images/receipt.png' />
      </div>
      <div>
        <div className='EmptyList-title'>Submit your first expense</div>
        <div className='EmptyList-description'>Once approved, you will be automatically reimbursed</div>
      </div>
    </div>
  );
};
