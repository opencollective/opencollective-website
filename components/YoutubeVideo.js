import React from 'react';

export default ({
  video,
  width='560',
  height='315'
}) => {
  
  if(!video || !video.match(/watch\?v=/)) {
    return;
  }
  
  const id = video.match(/watch\?v=([^&]*)/)[1];
  
  return (
    <div className='YoutubeVideo'>
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${id}`}
        frameBorder='0'
        allowFullScreen>
      </iframe>
    </div>
  );
}