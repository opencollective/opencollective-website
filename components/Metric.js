import React from 'react';

export default ({label, value, children}) => (
  <div className='Metric'>
    <div className='Metric-value'>
      {children || value}
    </div>
    <div className='Metric-label'>{label}</div>
  </div>
);