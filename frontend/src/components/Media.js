import React from 'react';

import YoutubeVideo from './YoutubeVideo';

export default ({group}) => {
  if (group.video) {
    return (
      <div className='PublicGroup-video'>
        <YoutubeVideo video={group.video} />
      </div>
    );
  } else if (group.image) {
    return (
      <div className='PublicGroup-image'>
        <img src={`https://res.cloudinary.com/opencollective/image/fetch/w_720/${encodeURIComponent(group.image)}`} />
      </div>
    );
  } else {
    return (
      <div className='PublicGroup-image'>
        <div className='PublicGroup-image-placeholder'/>
      </div>
    );
  }
};