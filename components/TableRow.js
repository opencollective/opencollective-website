import React from 'react';

const TableRow = ({children, value}) => {
  return (
    <div className='TableRow'>
      {children || value }
    </div>
  );
};

export default TableRow;

