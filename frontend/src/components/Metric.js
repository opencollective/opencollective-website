import React from 'react';

export default ({ className = '', label, value, children }) => (
  <div className={`Metric ${className}`}>
    <div className='Metric-value h3 -ff-sec -fw-bold'>
      {children || value}
    </div>
    <div className='Metric-label h6 muted'>{label}</div>
  </div>
);

