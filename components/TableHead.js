import React from 'react';

const TableHead = ({children, value}) => {
  return (
    <div className='TableHead'>
      {children || value}
    </div>
  );
};

export default TableHead;

