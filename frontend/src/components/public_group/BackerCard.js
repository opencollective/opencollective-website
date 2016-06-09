import React from 'react';

import UserPhoto from '../UserPhoto';

export default ({user, title, onClick}) => (
  <div className='BackerCard'>
  	<UserPhoto user={user} addBadge={true} customBadge='svg-star-badge' customBadgeSize='20' />
  	<div className='BackerCard-title'>{title}</div>
  	{onClick && <div className="BackerCard-button" onClick={onClick}>become backer</div>}
  </div>
);
