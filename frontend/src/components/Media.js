import React from 'react';
import { resizeImage } from '../lib/utils';
import YoutubeVideo from './YoutubeVideo';

export default ({group}) => {
  if (group.video) {
    return (
      <div className='PublicGroup-video absolute top-0 left-0 width-100 height-100'>
        <YoutubeVideo video={group.video} />
      </div>
    );
  } else if (group.image) {
    const extension = group.image.split('.').pop().toLowerCase();
    const image = (extension === 'svg') ? group.image : resizeImage(group.image, { width: 720 });
    const styles = {
      backgroundImage: `url(${image})`,
    }
    return (<div className='PublicGroup-image absolute top-0 left-0 bg-contain bg-center bg-no-repeat height-100 width-100' style={styles}></div>);
  } else {
    return (
      <div className='PublicGroup-image absolute top-0 left-0 bg-contain bg-center bg-no-repeat height-100 width-100' style={{backgroundImage: 'url(/static/images/whyjoin-placeholder.png)'}}></div>
    );
  }
};
