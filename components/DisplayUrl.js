import React from 'react';

export function displayUrl(url) {
  if(typeof url !== 'string') return '';
  return url
          .replace(/^https?:\/\/(www\.)?/,'')
          .replace(/\/$/,'')
}

export default ({url}) => { 
  return (
    <span><a href={url}>{displayUrl(url)}</a></span>
  )
};