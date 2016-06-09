import React from 'react';
import Icon from './Icon';

export default ({status}) => (
  <span className='TransactionStatus'>
    <Icon type={status.toLowerCase()} />{status[0].toUpperCase() + status.slice(1).toLowerCase()}
  </span>
);
