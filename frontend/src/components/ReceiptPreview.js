import React from 'react';

export default ({href, src, srcSet, label=''}) => {
  
  return (
    <a href={href}>
      <div>
        <img src={src} srcSet={srcSet}/>
        <label>{label}</label>
      </div>
    </a>
  );
};