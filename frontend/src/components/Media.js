import React from 'react';

import YoutubeVideo from './YoutubeVideo';

export default ({group}) => {
  if (group.video) {
    return (
      <div className='PublicGroup-video absolute width-100 height-100'>
        <YoutubeVideo video={group.video} />
      </div>
    );
  } else if (group.image) {
    const image = `https://res.cloudinary.com/opencollective/image/fetch/w_720/${encodeURIComponent(group.image)}`;
    const styles = {
      backgroundImage: `url(${image})`,
    }
    return (<div className='PublicGroup-image absolute bg-contain bg-center bg-no-repeat height-100 width-100' style={styles}></div>);
  } else {
    return (
      <div className='PublicGroup-image'>
        <div className='PublicGroup-image-placeholder'/>
      </div>
    );
  }
};
