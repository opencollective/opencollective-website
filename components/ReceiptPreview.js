import React from 'react';

export default ({href, src, label=''}) => {
  
  if(src.match(/\.pdf$/)) {
    src = '/static/images/mime-pdf.png';
  }

  return (
    <a href={href}>
      <div>
        <img src={src} />
        <label>{label}</label>
      </div>
    </a>
  );
};