import React from 'react';

export default ({ step, title, subtitle }) => (
  <div className='OnBoardingStepHeading'>
    <div>
      <strong>{step}</strong>&nbsp;<span>{title}</span>
    </div>
    {subtitle && <div>{subtitle.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</div>}
  </div>
)
