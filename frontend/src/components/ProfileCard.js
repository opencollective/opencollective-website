import React from 'react';

export default ({image, title, subtitle, footer}) => (
  <div className="ProfileCard">
    <div className="ProfileCard-image" style={{backgroundImage: `url(${image})`}}></div>
    <div className="ProfileCard-title">{title}</div>
    <div className="ProfileCard-subtitle">{subtitle}</div>
    <div className="ProfileCard-footer">{footer}</div>
  </div>
);
