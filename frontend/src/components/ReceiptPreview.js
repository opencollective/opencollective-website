import React from 'react';

export default ({href, src, srcSet, label=''}) => {
  
  if (src.match(/\.pdf$/)) {
    src = '/static/images/mime-pdf.png';
  }

  return (
    <a href={href}>
      <div>
        <img src={src} srcSet={srcSet}/>
        <label>{label}</label>
      </div>
    </a>
  );
};